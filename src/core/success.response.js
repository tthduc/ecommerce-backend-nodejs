"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  [StatusCode.OK]: "Success",
  [StatusCode.CREATED]: "Created",
};

/**
 * send(res, headers) (instance method) ở SuccessResponse
    → nằm trên SuccessResponse.prototype.

static send(res, {...}) (class method) ở Ok và CREATED
    → chỉ là tiện ích để tạo instance rồi gọi instance .send(...).

Ở đây:
    new Ok(...) → chạy constructor của Ok (gọi super(...)).
    .send(res, headers) → Ok không định nghĩa send, nên JS tìm lên prototype chain và dùng SuccessResponse.prototype.send.
    ⇒ Nghĩa là class con đang xài send của class cha thông qua kế thừa.
 */

class SuccessResponse {
    constructor(message, statusCode = StatusCode.OK, metadata = {}) {
        this.message = message || ReasonStatusCode[statusCode];
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        if (Object.keys(headers).length > 0) res.set(headers);
        return res.status(this.status).json(this);
    }

    // Tuỳ chọn: factory tổng quát nếu muốn dùng trực tiếp
    static send(res, { message, statusCode = StatusCode.OK, metadata = {}, headers = {} } = {}) {
        return new SuccessResponse(message, statusCode, metadata).send(res, headers);
    }
}

class Ok extends SuccessResponse {
    constructor(message, metadata) {
        super(message, StatusCode.OK, metadata);
    }

    // Convenience: Ok.send(res, { message?, metadata?, headers? })
    static send(res, { message, metadata = {}, headers = {} } = {}) {
        return new Ok(message, metadata).send(res, headers);
    }
}

class CREATED extends SuccessResponse {
    constructor(message, metadata, options = {}) {
        super(message, StatusCode.CREATED, metadata);
        this.options = options; // nếu cần trả thêm info
    }

    // Convenience: CREATED.send(res, { message?, metadata?, headers?, options? })
    static send(res, { message, metadata = {}, headers = {}, options = {} } = {}) {
        return new CREATED(message, metadata, options).send(res, headers);
    }
}

module.exports = { Ok, CREATED, SuccessResponse };
