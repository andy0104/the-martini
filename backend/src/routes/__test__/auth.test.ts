import request from 'supertest';
import server from '../../server';

it('Testing signup bad request', async () => {
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