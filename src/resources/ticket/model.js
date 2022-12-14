const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../../libs/utils')
const { Debug, errors, utils } = require('../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const debug = require('../../libs/debug')()
var mongoose = require('mongoose');

const TicketSchema = require('./schema-mg')


exports.createTicket = async fields => {
    const ticket = await TicketSchema.create(fields)

    return ticket
}

exports.responseBooking = async (id, code) => {
    if(code == '00') {
        await TicketSchema.findByIdAndUpdate(id,{status:'success'})
    }
    else {
        await TicketSchema.findByIdAndUpdate(id,{status:'failure'})
    }

    return 'success'
}

exports.findById = async (id) => {
    const ticket = await TicketSchema.findById(id).lean()

    return ticket
}

exports.getTickets = async (profileId,limit, skip) => {
    let total
    let tickets
    total = await TicketSchema.count({profileId: profileId,status: "success"})
    tickets = await TicketSchema.find({profileId: profileId,status: "success"}).sort({createdAt:-1}).skip(skip).limit(limit)
    return {tickets, total}
}

exports.readTicket = async id => {
    await TicketSchema.findByIdAndUpdate(id, {isReaded: true})

    return 'success'
}