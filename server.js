import express from "express";

const app = express();

app.get("/pay", (req, res) => {
  const publicId = process.env.CLOUDPAYMENTS_PUBLIC_ID || "";

  res.setHeader("content-type", "text/html; charset=utf-8");
  res.end(`<!doctype html><html lang="ru"><head>
  <meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Оплата брони</title></head><body style="font-family:Arial, sans-serif; padding:24px;">
  <h2>Оплата брони консультации</h2>
  <p id="status">Открываю оплату…</p>

  <script src="https://widget.cloudpayments.ru/bundles/cloudpayments.js"></script>
  <script>
    const params = new URLSearchParams(location.search);
    const invoiceId = params.get('invoice_id') || ('inv_' + Date.now());
    const amount = Number(params.get('amount') || 150);
    const description = params.get('desc') || 'Бронь консультации';
    const publicId = ${JSON.stringify(process.env.CLOUDPAYMENTS_PUBLIC_ID || "")};

    if(!publicId){
      document.getElementById('status').textContent = 'Ошибка: не задан CLOUDPAYMENTS_PUBLIC_ID';
    } else {
      const widget = new cp.CloudPayments();
      widget.pay('charge', { publicId, description, amount, currency:'RUB', invoiceId }, {
        onSuccess: () => document.getElementById('status').textContent = 'Оплата успешна ✅',
        onFail: () => document.getElementById('status').textContent = 'Оплата не прошла ❌'
      });
    }
  </script>
  </body></html>`);
});

app.get("/", (_, res) => res.redirect("/pay"));

app.listen(process.env.PORT || 3000);
