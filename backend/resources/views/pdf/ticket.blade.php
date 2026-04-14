<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ticket de Compra</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 14px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { max-width: 150px; margin-bottom: 10px; }
        .store-info { font-size: 12px; color: #666; }
        .order-info { margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        table { w-full; border-collapse: collapse; margin-bottom: 20px; width: 100%; }
        th { background-color: #f4f4f4; border-bottom: 2px solid #ddd; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .totals { width: 40%; float: right; }
        .totals-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .total-final { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; }
        .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #888; clear: both; }
    </style>
</head>
<body>

    <div class="header">
        <h2>{{ $storeData['name'] }}</h2>
        <div class="store-info">
            {{ $storeData['address'] }} <br>
            Tel: {{ $storeData['phone'] }} | {{ $storeData['email'] }}
        </div>
    </div>

    <div class="order-info">
        <h3>Pedido: #PED-{{ str_pad($order->id, 4, '0', STR_PAD_LEFT) }}</h3>
        <p><strong>Fecha:</strong> {{ $order->created_at->format('d/m/Y H:i') }} Hrs.</p>
        <p><strong>Cliente:</strong> {{ $order->user->name }}</p>
        <p><strong>Dirección de Entrega:</strong> {{ $order->address->street_and_number }}, {{ $order->address->neighborhood }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Cant.</th>
                <th>Producto</th>
                <th>SKU</th>
                <th style="text-align: right;">P. Unitario</th>
                <th style="text-align: right;">Importe</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->quantity }} pzas.</td>
                <td>{{ $item->product->name }}</td>
                <td>{{ $item->product->sku }}</td>
                <td style="text-align: right;">${{ number_format($item->price, 2) }}</td>
                <td style="text-align: right;">${{ number_format($item->price * $item->quantity, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table style="width: 100%;">
            <tr>
                <td><strong>Subtotal:</strong></td>
                <td style="text-align: right;">${{ number_format($order->subtotal, 2) }}</td>
            </tr>
            <tr>
                <td><strong>Envío:</strong></td>
                <td style="text-align: right;">${{ number_format($order->shipping_cost, 2) }}</td>
            </tr>
            <tr>
                <td class="total-final"><strong>TOTAL:</strong></td>
                <td class="total-final" style="text-align: right;">${{ number_format($order->total, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p>Gracias por tu compra. Este documento es un comprobante de pedido.</p>
    </div>

</body>
</html>