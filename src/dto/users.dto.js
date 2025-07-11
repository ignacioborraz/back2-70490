import crypto from "crypto";
import { createHash } from "../helpers/hash.helper.js";
const { PERSISTENCE } = process.env;

class UserDTO {
  constructor(data) {
    if (PERSISTENCE !== "mongo") {
      this._id = crypto.randomBytes(12).toString("hex");
    }
    this.name = data.name;
    this.date = data.date;
    this.email = data.email;
    this.password = createHash(data.password);
    this.avatar = data.avatar || "https://cdn-icons-png.flaticon.com/512/266/266033.png";
    this.role = data.role || "USER";
    this.isVerify = data.isVerify || false;
    this.verifyCode = crypto.randomBytes(12).toString("hex");
    if (PERSISTENCE !== "mongo") {
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  }
}

export default UserDTO;
