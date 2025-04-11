const express = require("express");

const router = require("express").Router();

const {AskSomething} = require("../controllers/geminiController/AskSomething");

router.post('/askSomething',AskSomething);

module.exports=router;