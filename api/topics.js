const express = require('express')
const router = express.Router()
const knex = require('../db/knex')
const queries = require('../queries/topics')

function validId(req, res, next){
    if(!isNaN(req.params.id)) return next()
    next( new Error ('Invalid ID'))
} 

router.get('/:id', validId, (req, res, next) => {
    knex('topics')
        .join('comments', 'topics.id', 'comments.topic_id')
        .where('topics.id', req.params.id)
        .then(comments => {
            res.json({topic: comments})
        })
    }
)

function getTopicsWithComments() {
    return knex('topics')
    .then(topics => {
        const promises = topics.map(topic => {
            // console.log(topic)
            return knex('comments').where({topic_id: topic.id})
            .then(comments => {
                topic.comments = comments
                console.log('comments',comments)
                return topic
            })
        })
        return Promise.all(promises)
    })
}

router.get('/', (req, res) => {
    getTopicsWithComments()
        .then(comments => {res.json(comments)})
    })


module.exports = router