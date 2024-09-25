import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from 'src/dto/CreateUserDto';

const createUserDto: CreateUserDto = {
  name: 'Test',
  email: 'test@mail.com',
  password: '1234567Test_',
  confirmPassword: '1234567Test_',
  address: 'Test 123',
  phone: 123456789,
  country: 'Test',
  city: 'Test',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userPayload = {
      id: 'valid-user-id',
      email: 'test@mail.com',
      roles: ['admin'],
    };

    token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('Get /users/ return an array of users with an OK status code', async () => {
    const req = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Object);
  });

  it('GET /users/ returns status code 401 if a valid token is not specified', async () => {
    const req = await request(app.getHttpServer()).get('/users');

    expect(req.status).toBe(401);
    expect(req.body.error).toEqual('Unauthorized');
    expect(req.body.message).toEqual('Token not found');
  });

  it('GET /users/:id returns status code 401 if a valid token is not specified', async () => {
    const req = await request(app.getHttpServer()).get(
      '/users/121asdbb-6ff2-41de-b9f0-964562b6e842',
    );

    expect(req.status).toBe(401);
    expect(req.body.error).toEqual('Unauthorized');
    expect(req.body.message).toEqual('Token not found');
  });

  it('GET /users/:id should return an user by id', async () => {
    const req = await request(app.getHttpServer())
      .get('/users/634b6faa-aad4-4297-9f17-ac789bab6f53')
      .set('Authorization', `Bearer ${token}`);

    expect(req.status).toBe(200);
  });

  it('POST /auth/signup should sign up a user ', async () => {
    const req = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(createUserDto);

    expect(req.status).toBe(201);
    expect(req.body).toHaveProperty('email');
    expect(req.body).not.toHaveProperty('password');
    expect(req.body.email).toEqual(createUserDto.email);
  });

  it('POST /auth/signup should throw an error if the user already has a registered account', async () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(createUserDto)
      .expect(400)
      .expect((req) => {
        expect(req.body.message).toEqual(
          'Su correo ya tiene una cuenta creada.',
        );
      });
  });

  it('POST /auth/signup should throw an error if the passwords do not match', async () => {
    const mockNewUser = {
      name: 'Test',
      email: 'validmail@mail.com',
      password: '1234567Test_',
      confirmPassword: '4567Test_',
      address: 'Test 123',
      phone: 123456789,
      country: 'Test',
      city: 'Test',
    };
    const req = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(mockNewUser);

    expect(req.status).toBe(400);
    expect(req.body.message).toEqual('Las contraseñas no coinciden.');
  });

  it('POST /auth/signin should throw an error if the email does not correspond to a registered user', async () => {
    const user = {
      email: 'noExistingUser@mail.com',
      password: '12345Test_',
    };
    const req = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(user);

    expect(req.status).toBe(400);
    expect(req.body.message).toEqual('Usuario y/o contraseña incorrecta');
  });

  it('POST /auth/signin should throw an error if the password is incorrect', async () => {
    const user = {
      email: 'test@mail.com',
      password: '12345Test_',
    };
    const req = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(user);

    expect(req.status).toBe(400);
    expect(req.body.message).toEqual('Usuario y/o contraseña incorrecta');
  });

  it('POST /auth/signin should return an object with message and token in case correct', async () => {
    const user = {
      email: 'test@mail.com',
      password: '1234567Test_',
    };
    const req = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(user);

    expect(req.status).toBe(201);
    expect(req.body.success).toEqual('user logged in successfully');
    expect(req.body).toHaveProperty('token');
  });

  it('GET /products should return products with limit and pagination', async () => {
    const req = await request(app.getHttpServer())
      .get('/products')
      .query({ limit: 5, page: 1 });

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
    expect(req.body.length).toBeLessThanOrEqual(5);
  });
});
