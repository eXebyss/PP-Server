const res = require('express/lib/response')
const Skill = require('../models/Skill')

class SkillController {
	saveSkill = async (req, res) => {
		try {
			const { name, text, date } = req.body
			const skill = new Skill({ name, text, date })
			await skill.save()
			console.log('New skill has been saved successfully!', skill)
			res.status(201).json({
				message: `New skill has been saved successfully!`,
			})
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: 'Ooopps... Something went wrong... 1.1' })
		}
	}

	getSkills = async (req, res) => {
		try {
			const skills = await Skill.find()
			res.status(200).json(skills)
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: 'Ooopps... Something went wrong... 2.1' })
		}
	}

	getSkill = async (req, res) => {
		try {
			const id = req.params.id
			const skill = await Skill.findById({ _id: id })
			res.status(200).json(skill)
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: 'Ooopps... Something went wrong... 3.1' })
		}
	}
}

module.exports = new SkillController()