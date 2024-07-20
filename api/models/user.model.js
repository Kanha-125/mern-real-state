import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKkAAACUCAMAAADf7/luAAAAMFBMVEXk5ueutLfp6uu4vsGpsLPb3t/f4eK2u76yuLvJzc/S1dfM0NK9wsXBxsjY29zFyswFIZU3AAAD1UlEQVR4nO2c23qDIAyAJRxF1Pd/24m2XQ+2BYKJ28d/td39i4SE07qu0Wg0Go1Go9FoNBqNfwhwCyQAAGaKmPgjt817jB+dumFnb7iN9gA9SKGUuGP5LQz6ZJEFHZzYQ7nRnMlVS7XrucmOZxkEYPoPnlFV9NyOKzDZj56rqzzDEPgS0Cue27Mb00SF4h4BIVF0UZ1ZB4BM9YyqI6NoekS3qHJ5wpjjGVUHngEAQ1ZEV3hmgCnbUwjHUq5ysumKCvTfH+b8bx9VPbmqKRIVwpJ//9y8vwV1IBYtSacN6qRKLfc7Qe1JR2rpKF2hNC1M/AuU6Q8ITyEknWinUaZOk4lmtyaPKMLqX1JI70zpGlW9v7ZPxpKZepyoUGSTf0Fj+mhKNlDLC9TFlKxMBZyoECOV6fdNky9YKlNk6guy0m/QoorKFJlQzfQvm3ZYUbpmGp377s/Mp7LVqGdQqyhBueeH7qUmIlF0fyqoRDuNTCnCxSkupQh30aHHxZRwbYqrp5Zuvd8BqkpR7kuDRwSVbo5aQQSVrOhvJJ7r7oWU+KSnfBuFbgNlA+ZSU/rDs0JRys3TjdL0J5xLb+QdRG/wHPKb/D5F0X/7COTvofMc8BYcmxNXp3vy5n+G090beVFlFI2davrdHu4bU0Oq6cR9Cw0mmxBWJU9wCxHM921/9gtoV74c9ivLNzs9AdB/GAKW6ZbUPmAGq3ZklQr+DBc6HzGzeHJVrj9BIu0AYPwcpLXOWinDvETzdOG8ES/xmwUd7/Nzy3ziIneRPJ/qGsfJ+3n59M6J9dmBcE6GcR78dJbwLhLTEAfnKviS+VHZhrGfDO/jjsWylwnL6eUvcHbkmv6h00MQe3PoW18lY2yJNUH34Xn2TJEVcvakmeYxm9JLOSBxXb76Sy3KjawK0/G1C/yI9NyQw7GDACZZxTNij1yt6JJtk7cod9CbtKW3r6i5ucojlquQvLTLovorr2WA1vzwv6ja+6lDtUR6da0aVvQx+Udcta0AfVg8L9RaZB+TSo+qoYIn7vJ2MhVOVKpO9h9AX56uPtu/V0V1WEAV0RVURClFMQOAJpl+KU0r1NF4oWrZUD18wn+l7IZKwcFYBUr6FdpsulJwtkY/SFdU/uVEFs+omtlYEVX7PTIfT5Y/KEST2QIW392ogMsRxd/ZRpDzKoW2MXlVzcgpVtGM03WGgv9I+h0Qljp6h0vdvsY+00OTPFGhr0GjSV2q8vQmDyTWKdxr0hqotHUK/qEW3jTt3xEw9PovpD334J5NI2ldKl/Dd0eKKcxWspO4SIUTkCTaaJyOH4LBMcmhFxu6AAAAAElFTkSuQmCC'
    }

}, { timestamps: true })


const User = mongoose.model("User", userSchema);

export default User;