import { Document } from "mongoose";

export interface IUserBio {
	_id: string;
	email: string;
	name: string;
	role: string;
	status: string;
	createdAt: Date;
	phone?: string;
}
// Define the IUser interface extending Mongoose Document
export interface IUser extends Document {
	name: string;
	email: string;
	phone?: string;
	password: string;
	status: "active" | "inactive" | "blocked";
	role: "user" | "admin" | "provider";
	createdAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
}
