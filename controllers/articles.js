const Article = require('../models/article');

// >---- GET ----< //

exports.getArticles = (req, res, next) => {
    Article.find()
        .then(articles => {
            res.render('useful-tips/articles', {
                pageTitle: 'Полезные советы',
                path: '/useful-tips',
                articles: articles
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStausCode = 500;
            return next(error);
        });
};

exports.getArticle = (req, res, next) => {
    const urlTitle = req.params.urlTitle;
    
    Article.findOne({ "urlTitle": urlTitle })
        .then(article => {
            res.render('useful-tips/article', {
                pageTitle: article.title,
                path: '/useful-tips',
                article: article
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStausCode = 500;
            return next(error);
        });
};