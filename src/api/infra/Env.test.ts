import Env from './Env'

const overrideEnvVariable = (key: string, value: any) => {
  const originalEnvVar = process.env[key]
  process.env[key] = value

  return originalEnvVar
}

const restoreEnvVariable = (key: string, originalEnvVar: string | null | undefined) => {
  if (originalEnvVar == null) {
    delete process.env[key]
  } else {
    process.env[key] = originalEnvVar
  }
}

describe('Env Infra', () => {
  it('get() returns a specific variable.', () => {
    const originalEnvVar = overrideEnvVariable('UT_ENV_VAR', 'some-variable')

    try {
      const env = new Env()
      expect(env.get('UT_ENV_VAR')).toBe('some-variable')
    } finally {
      restoreEnvVariable('UT_ENV_VAR', originalEnvVar)
    }
  })

  it('get() returns an empty string if the variable is not defined.', () => {
    const env = new Env({})
    expect(env.get('does_not_exist')).toBe('')
  })

  it ('getNumber() parses numbers correctly.', () => {
    const env = new Env({
      int: '101',
      float: '12.345',
      zero: '0',
      negative: '-987.654',
      exponential: '6.022e23'
    })

    expect(env.getNumber('int')).toBe(101)
    expect(env.getNumber('float')).toBe(12.345)
    expect(env.getNumber('negative')).toBe(-987.654)
  })

  it ('getNumber() throws if variable is not a number AND no default value was provided.', () => {
    const env = new Env({
      empty: '',
      NULL: 'null',
      UNDEFINED: 'undefined',
      STRING: 'text'
    })

    expect(() => env.getNumber('empty'))
      .toThrowError(/^EnvInvalidValue: variable "empty" is not a number. Was: ""$/)
    expect(() => env.getNumber('NULL'))
      .toThrowError(/^EnvInvalidValue: variable "NULL" is not a number. Was: "null"$/)
    expect(() => env.getNumber('UNDEFINED'))
      .toThrowError(/^EnvInvalidValue: variable "UNDEFINED" is not a number. Was: "undefined"$/)
    expect(() => env.getNumber('STRING'))
      .toThrowError(/^EnvInvalidValue: variable "STRING" is not a number. Was: "text"$/)
    expect(() => env.getNumber('DOES_NOT_EXIST'))
      .toThrowError(/^EnvInvalidValue: variable "DOES_NOT_EXIST" is not a number. Was: ""$/)
  })

  it ('getNumber() returns the default value if it cannot parse the number.', () => {
    const env = new Env({
      empty: '',
      NULL: 'null',
      UNDEFINED: 'undefined',
      STRING: 'text'
    })

    expect(env.getNumber('empty', 0)).toBe(0)
    expect(env.getNumber('NULL', 1)).toBe(1)
    expect(env.getNumber('UNDEFINED', 2)).toBe(2)
    expect(env.getNumber('STRING', 3.9)).toBe(3.9)
  })
})
