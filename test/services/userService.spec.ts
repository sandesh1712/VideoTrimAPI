import { Repository } from "typeorm";
import { UserService } from "../../src/services/userService";
import { User } from "../../src/entities/User";
import { AlreadyExistsError } from "../../src/errors/AlreadyExists";

const mockSave = jest.fn();
const mockFindBy = jest.fn();
const mockCreate = jest.fn();


const mockRepo: Partial<Repository<User>> = {
  save: mockSave,
  findBy: mockFindBy,
  create: mockCreate,

};

describe("User Service/", () => {
  const userService = new UserService(mockRepo as Repository<User>);

  describe("create user", () => {
    it("create user", async () => {
      const tempData = {
        firstName: "abc",
        lastName: "xyz",
        email: "abc@xyz.com",
        password: "test",
      };

      mockFindBy.mockImplementationOnce(() => []);
      mockCreate.mockImplementationOnce(() => tempData);
      mockSave.mockImplementationOnce(() => {
        const res = { ...tempData, id: 1 };
        delete res.password;
        return res;
      });

      const result = await userService.create(tempData);
      expect(result).toStrictEqual({
        firstName: "abc",
        lastName: "xyz",
        email: "abc@xyz.com",
        id: 1,
      });
    });

    it("create user with existing email", async () => {
      const tempData = {
        email: "abc@xyz.com",
      };

      mockFindBy.mockImplementationOnce(() => [tempData]);

      try {
        await userService.create(tempData);
      } catch (err) {
        expect(err instanceof AlreadyExistsError).toBe(true);
      }
    });
  });

  describe("findOneBy", () => {
    it("should return matching result", async () => {
      const tempData = {
        email: "abc@xyz.com",
      };
      mockFindBy.mockImplementationOnce(() => [tempData]);

      const result = await userService.findOneBy({ email: tempData.email });
      expect(result).toStrictEqual(tempData);
    });
    it("should return empty array if matching result not found", async () => {
      const tempData = {
        email: "abc@xyz.com",
      };
      mockFindBy.mockImplementationOnce(() => []);

      const result = await userService.findOneBy({ email: tempData.email });
      expect(result).toStrictEqual(undefined);
    });
  });

  describe("sign In", () => {
    const hashedPass =
      "e84a828db2133eacd2cb5f82c2aa0d7143d93073d5674176642cac551269f1be74319f9054bafff4e0d9976a1d9d3eef65b246317c1edb5ed8217b65871175cc.7a12dda4b9410f452082c2c2505d94d3";

    it("sign in success", async () => {
        //to be done
    });
  });
});
