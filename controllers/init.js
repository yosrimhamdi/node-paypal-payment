const paypal = require('paypal-rest-sdk');

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE } = process.env;

module.exports = async (req, res) => {
  paypal.configure({
    'mode': PAYPAL_MODE,
    'client_id': PAYPAL_CLIENT_ID,
    'client_secret': PAYPAL_CLIENT_SECRET,
  });

  const domain = `${req.protocol}://${req.get('host')}`;

  const config = {
    'intent': 'sale',
    'payer': {
      'payment_method': 'paypal',
    },
    'redirect_urls': {
      'return_url': `${domain}/success`,
      'cancel_url': `${domain}/failed`,
    },
    'transactions': [
      {
        'item_list': {
          'items': [
            {
              'name': 'dique dur externe',
              'sku': 'this is the sku field', // product id
              'price': '100',
              'currency': 'USD',
              'quantity': 2,
            },
          ],
        },
        'amount': {
          'currency': 'USD',
          'total': '200',
        },
        'description': 'This is the payment description.',
      },
    ],
  };

  paypal.payment.create(config, (e, payment) => {
    if (e) {
      res.status(500).json(e);
    } else {
      res.redirect(payment.links[1].href);
    }
  });
};
