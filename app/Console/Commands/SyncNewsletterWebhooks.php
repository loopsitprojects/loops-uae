<?php

namespace App\Console\Commands;

use App\Models\NewsletterSubscriber;
use App\Services\NewsletterWebhookService;
use Illuminate\Console\Command;

class SyncNewsletterWebhooks extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'newsletter:sync-webhook {--all : Sync all subscribers regardless of status} {--failed : Sync only previously failed subscribers}';

    /**
     * The console command description.
     */
    protected $description = 'Dispatch newsletter subscribers to the configured newsletter webhook';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $url = config('services.newsletter_webhook.url') ?: env('NEWSLETTER_WEBHOOK_URL');

        if (empty($url)) {
            $this->error('NEWSLETTER_WEBHOOK_URL is not configured in .env or services.php');
            return Command::FAILURE;
        }

        $query = NewsletterSubscriber::query();

        if ($this->option('failed')) {
            $query->where('webhook_status', 'failed');
        } elseif (!$this->option('all')) {
            $query->where('webhook_status', '!=', 'synced');
        }

        $subscribers = $query->get();

        if ($subscribers->isEmpty()) {
            $this->info('No eligible subscribers found to sync.');
            return Command::SUCCESS;
        }

        $this->info("Starting sync for {$subscribers->count()} subscribers to {$url}...");

        $success = 0;
        $failed = 0;

        $bar = $this->output->createProgressBar($subscribers->count());
        $bar->start();

        foreach ($subscribers as $subscriber) {
            $result = NewsletterWebhookService::send($subscriber, 'subscriber.sync');
            if (!empty($result['success'])) {
                $success++;
            } else {
                $failed++;
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Completed: {$success} synced successfully, {$failed} failed.");

        return $failed > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}
