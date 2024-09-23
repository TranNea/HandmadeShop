import { createContext } from "react";

//Context giúp truyền dữ liệu từ component cha xuống component con mà không cần thông qua các props từng cấp.
//UserContext dùng để lưu trữ trạng thái người dùng: chứng thực, login,...
export const UserContext = createContext()