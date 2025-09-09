<?php

namespace App\Http\Controllers;

use App\Models\NotificationTemplate;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $templates = NotificationTemplate::all()->map(function ($template) {
            $template->variables = json_decode($template->variables, true);
            return $template;
        });
        return response()->json($templates);
    }

    public function store(Request $request)
    {
        $templates = $request->input('template', []);

        foreach ($templates as $template) {
            NotificationTemplate::updateOrCreate(
                ['type' => $template['type']],
                [
                    'message' => $template['message'],
                    'enable_email' => $template['enable_email'] ?? false,
                    'enable_sms' => $template['enable_sms'] ?? false,
                ]
            );
        }

        return response()->json(['message' => 'Configurações salvas com sucesso!']);
    }  //


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $template = NotificationTemplate::findOrFail($id);

        $template->update([
            'message' => $request->message,
            'enable_email' => $request->enable_email ?? false,
            'enable_sms' => $request->enable_sms ?? false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mensagem atualizada com sucesso!',
            'template' => $template
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
