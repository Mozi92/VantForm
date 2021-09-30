import Vue from "vue";
import {Form, Field, Button} from "vant";

export function createForm() {
    return (
        <div>
            <van-form>
                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit">提交</van-button>
                </div>
            </van-form>
        </div>
    )
}