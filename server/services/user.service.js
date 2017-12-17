const dbService = require('../services/db.service');
const uploadFile = require('../services/uploadFile.service');
const mailService = require('../services/mail.service')
const collectionName = 'users';

const findOne = (req, res) => {
	const payload = req.params
	return dbService
		.getOne(collectionName, payload)
		.then(user => {
			res.status(200).json(user)
		})
		.catch(error => {
			console.log('ERROR => USER SERVICES FIND ONE', error);
			res.status(403).json({ error: error })
		});
};

const update = (req, res) => {
	avatar = req.file ? req.file.filename : ''
	return dbService
		.update(
		collectionName,
		{ pseudo: req.body.pseudo },
		{
			$set: {
				sex: req.body.sexe,
				birthDate: req.body.birthDate,
				city: req.body.city,
				pseudo: req.body.pseudo,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				avatar: avatar
			}
		}
		)
		.then(() => {
			console.log('success');
			res.status(200).json({});
		})
		.catch(error => {
			console.log('USERS.ROUTE => update user profil ERROR', error);
			res.status(500).send(error);
		});
};

const reset = (req, res) => {
	console.log(req.params)
	const userMail = req.params
	dbService.getOne(collectionName, userMail).then(result => {
		console.log(result)
		const user = {
			pseudo: result.pseudo,
			email: result.email
		}
		if (result) {
			mailService.sendMail(user)
		}
	})
}
module.exports = {
	findOne,
	update,
	reset
};
