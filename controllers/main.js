exports.getIndex = (req, res, next) => {
    res.render('main-page/index.ejs', {
        path: '/',
        pageTitle: 'Главная'
    });
};