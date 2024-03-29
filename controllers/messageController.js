const Message = require('../models/Message')
const { emailToReceiver, emailToSender } = require('../context/emails')
const saveMessage = require('../context/actions')
const emailTransporter = require('../helper')

require('dotenv').config()

class MessageController {
	sendMessage = (req, res) => {
		const name = req.body.name
		const email = req.body.email
		const message = req.body.message
		const date = req.body.date
		const dateString = req.body.dateString

		const emailRegEx =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

		if (!email) {
			res.status(400).json({ message: `Email address is required!` })
		} else if (!emailRegEx.test(String(email).toLowerCase())) {
			res
				.status(400)
				.json({ message: `Please provide a valid e-mail address!` })
		} else {
			emailTransporter.sendMail(
				emailToReceiver(name, email, message, dateString),
				function (err, data) {
					if (err) {
						console.log('Error: ' + err)
						res.status(400).json({ message: `Email sending Error 1!` })
					} else {
						console.log('Email to receiver sent successfully!')

						emailTransporter.sendMail(
							emailToSender(name, email, message, dateString),
							function (err, data) {
								if (err) {
									console.log('Error: ' + err)
									res.status(400).json({ message: `Email sending Error 2!` })
								} else {
									console.log('Email to sender sent successfully!')
									res.status(201).json({
										message: `Email to receiver and sender sent successfully!`,
									})
								}
							}
						)
					}
				}
			)

			saveMessage({ name, email, message, date, dateString })
		}
	}

	getMessages = async (req, res) => {
		try {
			const messages = await Message.find()
			res.status(200).json(messages)
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: 'Ooopps... Something went wrong... 1' })
		}
	}

	getMessage = async (req, res) => {
		try {
			const id = req.params.id
			const messages = await Message.findById({ _id: id })
			res.status(200).json(messages)
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: 'Ooopps... Something went wrong... 2' })
		}
	}
}

module.exports = new MessageController()
