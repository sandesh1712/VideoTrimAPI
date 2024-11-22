import { PasswordHelper } from "../../src/helpers/passwordHelper"

describe('Password Helper',()=>{
    describe('compare password',()=>{
        const hashedPass = 'e84a828db2133eacd2cb5f82c2aa0d7143d93073d5674176642cac551269f1be74319f9054bafff4e0d9976a1d9d3eef65b246317c1edb5ed8217b65871175cc.7a12dda4b9410f452082c2c2505d94d3'

        it("true is password macthes",async ()=>{
            const result = await PasswordHelper.comparePassword(hashedPass,'test');
            expect(result).toBe(true);
        })
        it("false if password not macthes",async ()=>{
            const result = await PasswordHelper.comparePassword(hashedPass,'test@123');
            expect(result).toBe(false);
        })
    })
})