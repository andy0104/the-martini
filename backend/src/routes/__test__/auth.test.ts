import request from 'supertest';
import server from '../../server';

it('Testing signup bad request with all fields empty', async () => {
  return request(server)
          .post('/auth/signup')
          .send({
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: ''
          })
          .then(response => {
            expect(response.status).toBe(422);
          })
});

it('Testing signup bad request with alternate empty fields', async () => {
  await request(server)
          .post('/auth/signup')
          .send({
            firstname: '',
            lastname: 'last',
            username: 'test-last',
            email: 'a@b.com',
            password: '1234'
          })
          .then(response => {
            expect(response.status).toBe(422);
          });
  await request(server)
          .post('/auth/signup')
          .send({
            firstname: 'first',
            lastname: '',
            username: 'test-last',
            email: 'a@b.com',
            password: '1234'
          })
          .then(response => {
            expect(response.status).toBe(422);
          });
  await request(server)
          .post('/auth/signup')
          .send({
            firstname: 'first',
            lastname: 'last',
            username: '',
            email: 'a@b.com',
            password: '1234'
          })
          .then(response => {
            expect(response.status).toBe(422);
          });
  await request(server)
          .post('/auth/signup')
          .send({
            firstname: 'first',
            lastname: 'last',
            username: 'test-test',
            email: '',
            password: '1234'
          })
          .then(response => {
            expect(response.status).toBe(422);
          });
  await request(server)
          .post('/auth/signup')
          .send({
            firstname: 'first',
            lastname: 'last',
            username: 'test-test',
            email: 'a@b.com',
            password: ''
          })
          .then(response => {
            expect(response.status).toBe(422);
          });
});

it('Checking for password less than 8 characters', async () => {
  await request(server)
          .post('/auth/signup')
          .send({
            firstname: 'first',
            lastname: 'last',
            username: 'test-test',
            email: 'a@b.com',
            password: '1234'
          })
          .then(response => {
            expect(response.status).toBe(422);
          });
});