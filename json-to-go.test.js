const jsonToGo = require("./json-to-go");

function quote(str) {
  return "'" + str
    .replace(/\t/g, "\\t")
    .replace(/\n/g, "\\n")
    .replace(/'/g, "\\'") + "'"
}

function test(includeExampleData) {
  const testCases = [
    {
      input: '{"SourceCode": "exampleDataHere"}',
      expected:
        'type AutoGenerated struct {\n\tSourceCode string `json:"SourceCode"`\n}',
      expectedWithExample:
        'type AutoGenerated struct {\n\tSourceCode string `json:"SourceCode" example:"exampleDataHere"`\n}',
    },
    {
      input: '{"source_code": "exampleDataHere"}',
      expected:
        'type AutoGenerated struct {\n\tSourceCode string `json:"source_code"`\n}',
      expectedWithExample:
        'type AutoGenerated struct {\n\tSourceCode string `json:"source_code" example:"exampleDataHere"`\n}'
      },
    {
      input: '{"sourceCode": "exampleDataHere"}',
      expected:
        'type AutoGenerated struct {\n\tSourceCode string `json:"sourceCode"`\n}',
      expectedWithExample:
        'type AutoGenerated struct {\n\tSourceCode string `json:"sourceCode" example:"exampleDataHere"`\n}'    },
    {
      input: '{"SOURCE_CODE": ""}',
      expected:
        'type AutoGenerated struct {\n\tSourceCode string `json:"SOURCE_CODE"`\n}',
      expectedWithExample:
        'type AutoGenerated struct {\n\tSourceCode string `json:"SOURCE_CODE"`\n}'
    },
    {
      input: '{"PublicIP": ""}',
      expected:
        'type AutoGenerated struct {\n\tPublicIP string `json:"PublicIP"`\n}',
      expectedWithExample:
        'type AutoGenerated struct {\n\tPublicIP string `json:"PublicIP"`\n}'    
    },
    {
      input: '{"public_ip": ""}',
      expected:
        'type AutoGenerated struct {\n\tPublicIP string `json:"public_ip"`\n}',
      expectedWithExample:
        'type AutoGenerated struct {\n\tPublicIP string `json:"public_ip"`\n}'
    },
    {
      input: '{"publicIP": ""}',
      expected:
        'type AutoGenerated struct {\n\tPublicIP string `json:"publicIP"`\n}',
      expectedWithExample:
        'type AutoGenerated struct {\n\tPublicIP string `json:"publicIP"`\n}'
    },
    {
      input: '{"PUBLIC_IP": ""}',
      expected:
        'type AutoGenerated struct {\n\tPublicIP string `json:"PUBLIC_IP"`\n}',
      expectedWithExample:
        'type AutoGenerated struct {\n\tPublicIP string `json:"PUBLIC_IP"`\n}'
    },
    {
      input: '{"+1": "Fails", "-1": "This should not cause duplicate field name"}',
      expected:
        'type AutoGenerated struct {\n\tNum1 string `json:"+1"`\n\tNum10 string `json:"-1"`\n}',
      expectedWithExample:
        'type AutoGenerated struct {\n\tNum1 string `json:"+1" example:"Fails"`\n\tNum10 string `json:"-1" example:"This should not cause duplicate field name"`\n}'
    },
    {
      input: '{"age": 46}',
      expected:
        'type AutoGenerated struct {\n\tAge int `json:"age"`\n}',
      expectedWithExample:
        'type AutoGenerated struct {\n\tAge int `json:"age" example:"46"`\n}'
    },
    {
      input: '{"topLevel": { "secondLevel": "exampleDataHere"} }',
      expected:
        'type AutoGenerated struct {\n\tTopLevel struct {\n\t\tSecondLevel string `json:"secondLevel"`\n\t} `json:"topLevel"`\n}',
      expectedWithExample:
        'type AutoGenerated struct {\n\tTopLevel struct {\n\t\tSecondLevel string `json:"secondLevel" example:"exampleDataHere"`\n\t} `json:"topLevel"`\n}'
    },
    {
      input: '{"people": [{ "name": "Frank"}, {"name": "Dennis"}, {"name": "Dee"}, {"name": "Charley"}, {"name":"Mac"}] }',
      expected:
        'type AutoGenerated struct {\n\tPeople []struct {\n\t\tName string `json:"name"`\n\t} `json:"people"`\n}',
      expectedWithExample:
        'type AutoGenerated struct {\n\tPeople []struct {\n\t\tName string `json:"name" example:"Frank"`\n\t} `json:"people"`\n}'
    } ];

  for (const testCase of testCases) {
    const got = jsonToGo(testCase.input, null, null, includeExampleData);
    if (got.error) {
      console.assert(!got.error, `format('${testCase.input}'): ${got.error}`);
    } else {
      exp = includeExampleData ? testCase.expectedWithExample : testCase.expected
      console.assert(
        got.go === exp,
        `format('${testCase.input}'): \n\tgot:  ${quote(got.go)}\n\twant: ${
          quote(exp)
        }`
      );
    }
  }

  console.log("done")
}

test(false);
test(true)
