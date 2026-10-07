<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class ContactSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email:rfc,dns', 'max:255'],
            'company'        => ['nullable', 'string', 'max:255'],
            'service'        => ['nullable', 'string', 'max:100'],
            'message'        => ['required', 'string', 'min:10', 'max:5000'],
            'office_context' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'    => 'Please tell us your name.',
            'email.required'   => 'We need your email to get back to you.',
            'email.email'      => 'That email address doesn\'t look right.',
            'message.required' => 'Please tell us a bit about your project.',
            'message.min'      => 'Tell us a little more (at least 10 characters).',
        ];
    }
}
