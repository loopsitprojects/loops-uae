<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    protected $fillable = [
        'name', 'email', 'company', 'service', 'message',
        'office_context', 'ip_address', 'user_agent', 'read_at',
    ];

    protected $casts = ['read_at' => 'datetime'];

    public function markAsRead(): void
    {
        $this->update(['read_at' => now()]);
    }

    public function getIsReadAttribute(): bool
    {
        return $this->read_at !== null;
    }
}
