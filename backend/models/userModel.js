const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        maxlength: 32,
        index: true,
        lowercase: true
    },
    
    name: {
        
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },

    profile: {
        type: String,
        require: true
    },


    password: {
        type: String,
        required: [true,'password required'],
        select: false
    },

    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function(val) {
                return this.password === val
            },
            message: 'password didn\'t matched'

        } 
    },

    about: {
        type: String
    },
    role: {
        type: Number,
        default: 0
    },
    photo:{
        data: Buffer,
        contenType: String
    },
    resetPasswordLink: {
        data: String,
        default: ''
    }


    
    
}, {
    timestamps: true
})

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined

    next()

})


userSchema.methods = {
    authenticate: async function(candidatePassword, userPassword){
        return await bcrypt.compare(candidatePassword, userPassword)
    }
}


const User = mongoose.model('User', userSchema)


module.exports = User