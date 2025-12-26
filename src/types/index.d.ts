import { JWTPayload } from "jsonwebtoken";


declare global{
    namespace Express{
        interface Request{
            user?: JWTPayload
        }
    }
}