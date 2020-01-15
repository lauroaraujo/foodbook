import Response from './Response'

describe('Response Infra', () => {
  it('can set the response status', () => {
    const res = Response.createNull()
    res.status(201)
    expect(res.getLastStatus()).toBe(201)

    res.status(404)
    expect(res.getLastStatus()).toBe(404)
  })

  it('Can set the response with send()', () => {
    const res = Response.createNull()
    res.send('response result')
    expect(res.getLastOutput()).toBe('response result')

    res.send(201)
    expect(res.getLastOutput()).toBe(201)

    res.send({ a: 'response '})
    expect(res.getLastOutput()).toEqual({ a: 'response '})
  })

  it('Can set the response with json()', () => {
    const res = Response.createNull()
    res.json('json result')
    expect(res.getLastOutput()).toBe('json result')

    res.json(201)
    expect(res.getLastOutput()).toBe(201)

    res.json({ a: 'json '})
    expect(res.getLastOutput()).toEqual({ a: 'json '})
  })
})
