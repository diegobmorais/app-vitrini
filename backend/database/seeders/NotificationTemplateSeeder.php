<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NotificationTemplate;

class NotificationTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'type' => 'Bem-vindo',
                'message' => 'Bem-vindo(a) ao nosso sistema, {{name}}! Estamos felizes em tê-lo conosco.',
                'variables' => ['{{name}}'],
            ],
            [
                'type' => 'Confirmação de pedido',
                'message' => 'Seu pedido {{order_id}} foi confirmado com sucesso! Obrigado por comprar conosco.',
                'variables' => ['{{order_id}}'],
            ],
            [
                'type' => 'Pedido enviado',
                'message' => 'Seu pedido {{order_id}} foi enviado! Você pode acompanhar o status pelo nosso site.',
                'variables' => ['{{order_id}}'],
            ],
            [
                'type' => 'Produto fora de estoque',
                'message' => 'Infelizmente o produto {{product}} está fora de estoque. Entraremos em contato em breve.',
                'variables' => ['{{product}}'],
            ],
            [
                'type' => 'Pagamento pendente',
                'message' => 'Detectamos que o pagamento do pedido {{order_id}} ainda não foi confirmado. Finalize o pagamento para não perder o pedido.',
                'variables' => ['{{order_id}}'],
            ],
            [
                'type' => 'Pedido entregue',
                'message' => 'Pedido {{order_id}} entregue! Obrigado por comprar conosco.',
                'variables' => ['{{order_id}}'],
            ],
            [
                'type' => 'Pedido cancelado',
                'message' => 'Seu pedido {{order_id}} foi cancelado. Se foi um engano, entre em contato conosco. Obrigado.',
                'variables' => ['{{order_id}}'],
            ],
            [
                'type' => 'Confirmação de agendamento',
                'message' => 'Seu agendamento para {{service}} foi confirmado. Obrigado por escolher nossos serviços.',
                'variables' => ['{{service}}'],
            ],
            [
                'type' => 'Cancelamento de agendamento',
                'message' => 'O agendamento de {{service}} foi cancelado.',
                'variables' => ['{{service}}'],
            ],
            [
                'type' => 'Reagendamento',
                'message' => 'Seu agendamento foi alterado para {{data}}, conforme solicitado.',
                'variables' => ['{{data}}'],
            ],
            [
                'type' => 'Confirmação de cadastro',
                'message' => 'Bem-vindo(a), {{user}} Sua conta foi criada com sucesso.',
                'variables' => ['{{user}}'],
            ],
            [
                'type' => 'Alteração de senha',
                'message' => 'Sua senha foi alterada com sucesso.',
                'variables' => [],
            ],
            [
                'type' => 'Novo pedido recebido',
                'message' => 'Novo pedido {{order_id}} realizado por João Silva.',
                'variables' => ['{{order_id}}'],
            ],
            [
                'type' => 'Agendamento marcado',
                'message' => 'Agendamento de banho para {{pet_name}} confirmado para {{service}}.',
                'variables' => ['{{pet_name}}', '{{service}}'],
            ],
            [
                'type' => 'Estoque baixo',
                'message' => 'Atenção! Estoque de ração premium abaixo de {{min_stock}} unidades.',
                'variables' => ['{{min_stock}}'],
            ],
        ];

        foreach ($templates as $template) {
            NotificationTemplate::firstOrCreate(
                ['type' => $template['type']],
                [
                    'message' => $template['message'],
                    'enable_email' => true,
                    'enable_sms' => false,
                    'variables' => json_encode($template['variables']),
                ]
            );
        }
    }
}
