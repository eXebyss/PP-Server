const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const cors = require('cors')
const compression = require('compression')
const messageRouter = require('./routes/message.routes')
const serverStatusRouter = require('./routes/serverStatus.routes')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(compression())

app.use('/api/messages', messageRouter)
app.use('/api/server-status', serverStatusRouter)

const start = async () => {
	try {
		await mongoose.connect(process.env.DB_URL)

		app.listen(process.env.PORT || 3000, () => {
			console.log(
				`Nodemailer is listening at http://localhost:${process.env.PORT}`
			)
		})
	} catch (err) {
		console.log(err)
	}
}

start()
