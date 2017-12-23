const uuidv4 = require('uuid/v4')
const moment = require('moment')
const dbService = require('../services/db.service');
const uploadFile = require('../services/uploadFile.service');
const mailService = require('../services/mail.service');
const passwordService = require('../services/password.service')

const COLLECTION_NAME = 'users';



const findOne = (req, res) => {
	const payload = req.params
	return dbService
		.getOne(COLLECTION_NAME, payload)
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
		COLLECTION_NAME,
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
			res.status(200).json({ message: 'Votre profil a été mis à jour' });
		})
		.catch(error => {
			console.log('USERS.ROUTE => update user profil ERROR', error);
			res.status(500).json({ error: error });
		});
};


const createResetUrl = (req, res) => {

	const userMail = req.params

	dbService.getOne(COLLECTION_NAME, userMail)
		.then(result => {

			if (result) {

				const uuid = uuidv4();
				const resetLink = 'http://localhost:3001/resetPassword/' + uuid;
				const expirationDate = moment().add(1, 'days').format('YYYY-MM-DD');

				dbService.update(COLLECTION_NAME, { pseudo: result.pseudo }, {
					$set: {
						resetPasswordLink: resetLink,
						resetPasswordLinkExpirationDate: expirationDate
					}
				})
				.then(() => {
					const user = {
						pseudo: result.pseudo,
						email: result.email,
						link: resetLink
					}
					mailService.sendMail(user, (error, result) => {
						if (error) {
							res.status(500).json({ error: error + 'mail not send' })
							return;
						}

					})
					res.status(200).json({ message: 'mail send'})
				})
				.catch(error => {
					res.status(500).json({ error: error + 'db not update'})
				})
			}
			else {
				res.status(500).json({ error: error })
			}
		})
	.catch(error => {
		res.status(500).json({error: error + 'cannot get user fail'})
	})
}

const checkResetUrl = (req, res) => {
	const token = req.body.token.split('/')
	console.log(token)
}



module.exports = {
	findOne,
	update,
	createResetUrl,
	checkResetUrl
};

