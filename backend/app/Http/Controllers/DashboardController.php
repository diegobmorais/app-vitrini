<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // 🔹 Vendas (somatório do valor total dos pedidos finalizados)
        $totalSales = Order::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('total');

        $lastMonthSales = Order::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('total');

        $salesGrowth = $lastMonthSales > 0
            ? (($totalSales - $lastMonthSales) / $lastMonthSales) * 100
            : 100;

        // 🔹 Pedidos
        $totalOrders = Order::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        $lastMonthOrders = Order::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

        $ordersGrowth = $lastMonthOrders > 0
            ? (($totalOrders - $lastMonthOrders) / $lastMonthOrders) * 100
            : 100;

        // 🔹 Clientes
        $totalCustomers = User::count();
        $customersThisMonth = User::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        $lastMonthCustomers = User::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

        $customersGrowth = $lastMonthCustomers > 0
            ? (($customersThisMonth - $lastMonthCustomers) / $lastMonthCustomers) * 100
            : 100;

        // 🔹 Produtos
        $totalProducts = Product::count();
        $lowStockCount = Product::all()
            ->filter(function ($product) {
                return $product->stock_quantity < 5;
            })
            ->count();

        return response()->json([
            'totalSales' => $totalSales,
            'salesGrowth' => round($salesGrowth, 2),

            'totalOrders' => $totalOrders,
            'ordersGrowth' => round($ordersGrowth, 2),

            'totalCustomers' => $totalCustomers,
            'customersGrowth' => round($customersGrowth, 2),

            'totalProducts' => $totalProducts,
            'lowStockCount' => $lowStockCount,
        ]);
    }
    public function salesByPeriod(Request $request)
    {
        $period = $request->get('period', '7D'); // default 7 dias
        $now = Carbon::now();

        switch ($period) {
            case '7D':
                $startDate = $now->copy()->subDays(7);
                $groupFormat = '%Y-%m-%d'; // agrupa por dia
                break;

            case '30D':
                $startDate = $now->copy()->subDays(30);
                $groupFormat = '%Y-%m-%d';
                break;

            case '3M':
                $startDate = $now->copy()->subMonths(3);
                $groupFormat = '%Y-%m-%m'; // agrupa por mês
                break;

            case '1A':
                $startDate = $now->copy()->subYear();
                $groupFormat = '%Y-%m'; // agrupa por mês
                break;

            default:
                $startDate = $now->copy()->subDays(7);
                $groupFormat = '%Y-%m-%d';
        }

        $sales = DB::table('orders')
            ->select(
                DB::raw("DATE_FORMAT(created_at, '{$groupFormat}') as period"),
                DB::raw("SUM(total) as total_sales")
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        return response()->json($sales);
    }
}
