const db = require('../db/index');
const bcrypt = require("bcrypt");
const { func } = require('joi');

async function registerUser(register) {
    const reg = JSON.parse(JSON.stringify(register));
    if(!reg.password || !reg.confirmPassword){
        return {message : "Enter a password"}
    }

    if (reg.password !== reg.confirmPassword){
        return {message : "Password does not match"}
    }

    if (reg.password === reg.confirmPassword) {

        const check = await db.query(
            `SELECT * FROM user WHERE user.email = ?`,
            [reg.email]
        )
        if(check[0]){
            return {message : 'Email is taken'}
        }
        
        let hashedPass = await bcrypt.hash(reg.password, 10);
        const rows = await db.query(
            `
            INSERT INTO user(first_name, last_name, email) VALUES (?,?,?);
            `,
            [reg.firstName, reg.lastName, reg.email]
        )

        const [user] = await db.query(
            `SELECT * FROM user WHERE user.email = ?`,
            [reg.email]
        )
         

        await db.query(
            `
            INSERT INTO user_password(user_id, hashed_password) VALUES (?, ?);
            `,
            [user.id, hashedPass]
        )

        let message = 'Error service register'
        if(rows.affectedRows){
            message = 'Registration successful'
        }

        return { message, user };
    }

}

async function userByEmail(login){
    const data = JSON.parse(JSON.stringify(login));
    const [userByEmail] = await db.query(
        `
        SELECT * FROM user WHERE user.isActive = 1 AND user.email = ?
        `,
        [data.email]
    )
    if(!userByEmail){
        return {message: 'User not found'}
    }
    
    const record = userByEmail;
    const user = {
        id: record.id,
        firstName: record.first_name,
        lastName: record.last_name,
        email: record.email,
        phone: record.phone
    }
    
    return {user};
}

async function matchPass(pass){
    const data = JSON.parse(JSON.stringify(pass));
    
    const [rows] = await db.query(
        `
        SELECT * FROM user
        INNER JOIN user_password
        ON user.id = user_password.user_id
        WHERE user.email = ? AND user.isActive = 1
        `,
        [data.email]
    )

    if(!rows){
        return {message: 'User not found'}
    }

    const password = JSON.stringify(data.password)

    const match = await bcrypt.compare(
        data.password,
        rows.hashed_password
    )

    if(!match){
        throw {message: "Wrong credentials"}
    } else {
        return;
    }
}

module.exports = {
    registerUser,
    userByEmail,
    matchPass
}