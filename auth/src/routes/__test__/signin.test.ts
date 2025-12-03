import request from "supertest";
import { app } from "../../app";

it('fails becuse of signin with incorrect credintails', async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400);
});


it("fail when an incorrect password provided", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "pasd"
        })
        .expect(400);
});

it("fail when an incorrect email provided", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@testdfasf.com",
            password: "password"
        })
        .expect(400);
});


it('respond with a cookie when give valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
})
