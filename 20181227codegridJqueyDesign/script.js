var model = {
	dispatcher: $({}),
	_amount: 100,
	_currency: 'JPY',

	getAmount: function () {
		return this._amount;	
	},
	setAmount: function( val ) {
		this._amount = val;
		this.dispatcher.trigger('dataChange');
	},
	getCurrency: function() {
		return this._currency;
	},
	setCurrency: function( val ) {
		this._currency = val;
		this.dispatcher.trigger('dataChange');
	}
};

var vsJPY = {
	'JPY': 1,
	'USD': 110,
	'EUR': 130,
	'GBP': 150
}

$result = $('#result');


var render = function() {
	var jpy = model.getAmount() / vsJPY[ 'JPY' ] * vsJPY[ model.getCurrency() ];
	var usd = model.getAmount() / vsJPY[ 'USD' ] * vsJPY[ model.getCurrency() ];
	var eur = model.getAmount() / vsJPY[ 'EUR' ] * vsJPY[ model.getCurrency() ];
	var gbp = model.getAmount() / vsJPY[ 'GBP' ] * vsJPY[ model.getCurrency() ];

	var htmlSrc =
	'<table>' +
		'<caption>両替後</caption>' +
		'<tr><th>￥</th><td>' + jpy +' 円</td></tr>' +
		'<tr><th>＄</th><td>' + usd +' ドル</td></tr>' +
		'<tr><th>€</th><td>' + eur +' ユーロ</td></tr>' +
		'<tr><th>￡</th><td>' + gbp +' ポンド</td></tr>' +
	'</table>';

	$result.html(htmlSrc);
}

render();
model.dispatcher.on('dataChange', render);

var $amount = $('#amount');
var $currency = $('#currency');

$amount.on('input', function() {
	model.setAmount(parseInt($amount.val()));
});

$amount.on('change', function() {
	model.setAmount(parseInt($amount.val()));
});

$currency.on('change', function() {
	model.setCurrency($currency.val());
});
