import {describe, test, expect} from "@jest/globals";
import ApiService from "../src/utils/my.axios";

const apiService = new ApiService()

describe('测试apiService', () => {
    test('apiService类型是ApiService', () => {
        expect(apiService).toBeInstanceOf(ApiService)
    })
})
