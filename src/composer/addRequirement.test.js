const addRequirement = require('./addRequirement');

test('it updates existing requirement', () => {
  const lock = {
    packages: [
      {
        name: 'silverorange/swat',
        version: '4.2.0'
      }
    ]
  };

  const json = {
    require: {
      'silverorange/swat': '^4.0.0',
      'silverorange/store': '^3.2.0'
    }
  };

  const dependency = {
    fullName: 'silverorange/swat',
    headSha: '47f675314e3cb68f99f36708b539ac37903be8bc'
  };

  addRequirement(json, lock, dependency);

  expect(json).toEqual({
    require: {
      'silverorange/swat':
        'dev-master#47f675314e3cb68f99f36708b539ac37903be8bc as 4.2.0',
      'silverorange/store': '^3.2.0'
    }
  });
});

test('it adds new requirement', () => {
  const lock = {
    packages: [
      {
        name: 'silverorange/swat',
        version: '4.2.0'
      }
    ]
  };

  const json = {
    require: {
      'silverorange/swat': '^4.0.0',
      'silverorange/store': '^3.2.0'
    }
  };

  const dependency = {
    fullName: 'silverorange/admin',
    headSha: '47f675314e3cb68f99f36708b539ac37903be8bc'
  };

  addRequirement(json, lock, dependency);

  expect(json).toEqual({
    require: {
      'silverorange/swat': '^4.0.0',
      'silverorange/store': '^3.2.0',
      'silverorange/admin':
        'dev-master#47f675314e3cb68f99f36708b539ac37903be8bc'
    }
  });
});
