import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email:{type: String, required: true, unique: true},
    authentication:{
        password: {type: String, required: true, select: false},
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false},
    }
});

export const UserModel = mongoose.model("User", userSchema);

export const getUsers = () => UserModel.find();

export const getUserByEmail = (email: String) => UserModel.findOne({ email });

export const getUserBySessionToken = (sessionToken: String) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const getUserById = (id: String) => {
  UserModel.findById(id);
};

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: String) => UserModel.findByIdAndDelete(id);

export const updateUserById = (id: String, user: any) =>
  UserModel.findByIdAndUpdate(id, user);

