initAnalytics();

function initAnalytics()
{
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-86578-22', 'auto');
	ga('send', 'pageview');
}

$(function()
{
	const emptyInputMsg = "Paste JSON here";
	const emptyOutputMsg = "Go will appear here";
	const formattedEmptyInputMsg = '<span style="color: #777;">'+emptyInputMsg+'</span>';
	const formattedEmptyOutputMsg = '<span style="color: #777;">'+emptyOutputMsg+'</span>';

	function doConversion()
	{
		var input = $('#input').text().trim();
		if (!input || input == emptyInputMsg)
		{
			$('#output').html(formattedEmptyOutputMsg);
			return;
		}

		let output = jsonToGo(input, "", !$('#inline').is(':checked'), false);

		if (output.error)
		{
			$('#output').html('<span class="clr-red">'+output.error+'</span>');
			console.log("ERROR:", output, output.error);
			var parsedError = output.error.match(/Unexpected token .+ in JSON at position (\d+)/);
			if (parsedError) {
				try {
					var faultyIndex = parsedError.length == 2 && parsedError[1] && parseInt(parsedError[1]);
					faultyIndex && $('#output').html(constructJSONErrorHTML(output.error, faultyIndex, input));
				} catch(e) {}
			}
		}
		else
		{
			var finalOutput = output.go;
			if (typeof gofmt === 'function')
				finalOutput = gofmt(output.go);
			var coloredOutput = hljs.highlight("go", finalOutput);
			$('#output').html(coloredOutput.value);
		}
	}

	// Hides placeholder text
	$('#input').on('focus', function()
	{
		var val = $(this).text();
		if (!val)
		{
			$(this).html(formattedEmptyInputMsg);
			$('#output').html(formattedEmptyOutputMsg);
		}
		else if (val == emptyInputMsg)
			$(this).html("");
	});

	// Shows placeholder text
	$('#input').on('blur', function()
	{
		var val = $(this).text();
		if (!val)
		{
			$(this).html(formattedEmptyInputMsg);
			$('#output').html(formattedEmptyOutputMsg);
		}
	}).blur();

	// If tab is pressed, insert a tab instead of focusing on next element
	$('#input').keydown(function(e)
	{
		if (e.keyCode == 9)
		{
			document.execCommand('insertHTML', false, '&#009'); // insert tab
			e.preventDefault(); // don't go to next element
		}
	});

	// Automatically do the conversion on paste or change
	$('#input').keyup(function()
	{
		doConversion();
	});

	// Also do conversion when inlining preference changes
	$('#inline').change(function()
	{
		doConversion();
	})

	// Highlights the output for the user
	$('#output').click(function()
	{
		if (document.selection)
		{
			var range = document.body.createTextRange();
			range.moveToElementText(this);
			range.select();
		}
		else if (window.getSelection)
		{
			var range = document.createRange();
			range.selectNode(this);
			var sel = window.getSelection();
			sel.removeAllRanges(); // required as of Chrome 60: https://www.chromestatus.com/features/6680566019653632
			sel.addRange(range);
		}
	});

	// Fill in sample JSON if the user wants to see an example
	$('#sample1').click(function()
	{
		$('#input').text(stringify(sampleJson1)).keyup();
	});
	$('#sample2').click(function()
	{
		$('#input').text(stringify(sampleJson2)).keyup();
	});

	var dark = false;
	$("#dark").click(function()
	{
		if(!dark)
		{
			$("head").append("<link rel='stylesheet' href='resources/css/dark.css' id='dark-css'>");
			$("#dark").html("Light mode");
		} else
		{
			$("#dark-css").remove();
			$("#dark").html("Dark mode");
		}
		dark = !dark;
	});

	// Copy contents of the output to clipboard
	$("#copy-btn").click(function() {
		var elm = document.getElementById("output");

		if(document.body.createTextRange) {
			// for ie
			var range = document.body.createTextRange();

			range.moveToElementText(elm);
			range.select();

			document.execCommand("Copy");
		} else if(window.getSelection) {
			// other browsers
			var selection = window.getSelection();
			var range = document.createRange();

			range.selectNodeContents(elm);
			selection.removeAllRanges();
			selection.addRange(range);

			document.execCommand("Copy");
		}
	})
});

function constructJSONErrorHTML(rawErrorMessage, errorIndex, json) {
	var errorHeading = '<p><span class="clr-red">'+ rawErrorMessage +'</span><p>';
	var markedPart = '<span class="json-go-faulty-char">' + json[errorIndex] + '</span>';
	var markedJsonString = [json.slice(0, errorIndex), markedPart, json.slice(errorIndex+1)].join('');
	var jsonStringLines = markedJsonString.split(/\n/);
	for(var i = 0; i < jsonStringLines.length; i++) {

		if(jsonStringLines[i].indexOf('<span class="json-go-faulty-char">') > -1)  // faulty line
			var wrappedLine = '<div class="faulty-line">' + jsonStringLines[i] + '</div>';
		else 
			var wrappedLine = '<div>' + jsonStringLines[i] + '</div>';

		jsonStringLines[i] = wrappedLine;
	}
	return (errorHeading + jsonStringLines.join(''));
}

// Stringifies JSON in the preferred manner
function stringify(json)
{
	return JSON.stringify(json, null, "\t");
}


// From the SmartyStreets API
var sampleJson1 = [
	{
		"input_index": 0,
		"candidate_index": 0,
		"delivery_line_1": "1 N Rosedale St",
		"last_line": "Baltimore MD 21229-3737",
		"delivery_point_barcode": "212293737013",
		"components": {
			"primary_number": "1",
			"street_predirection": "N",
			"street_name": "Rosedale",
			"street_suffix": "St",
			"city_name": "Baltimore",
			"state_abbreviation": "MD",
			"zipcode": "21229",
			"plus4_code": "3737",
			"delivery_point": "01",
			"delivery_point_check_digit": "3"
		},
		"metadata": {
			"record_type": "S",
			"zip_type": "Standard",
			"county_fips": "24510",
			"county_name": "Baltimore City",
			"carrier_route": "C047",
			"congressional_district": "07",
			"rdi": "Residential",
			"elot_sequence": "0059",
			"elot_sort": "A",
			"latitude": 39.28602,
			"longitude": -76.6689,
			"precision": "Zip9",
			"time_zone": "Eastern",
			"utc_offset": -5,
			"dst": true
		},
		"analysis": {
			"dpv_match_code": "Y",
			"dpv_footnotes": "AABB",
			"dpv_cmra": "N",
			"dpv_vacant": "N",
			"active": "Y"
		}
	},
	{
		"input_index": 0,
		"candidate_index": 1,
		"delivery_line_1": "1 S Rosedale St",
		"last_line": "Baltimore MD 21229-3739",
		"delivery_point_barcode": "212293739011",
		"components": {
			"primary_number": "1",
			"street_predirection": "S",
			"street_name": "Rosedale",
			"street_suffix": "St",
			"city_name": "Baltimore",
			"state_abbreviation": "MD",
			"zipcode": "21229",
			"plus4_code": "3739",
			"delivery_point": "01",
			"delivery_point_check_digit": "1"
		},
		"metadata": {
			"record_type": "S",
			"zip_type": "Standard",
			"county_fips": "24510",
			"county_name": "Baltimore City",
			"carrier_route": "C047",
			"congressional_district": "07",
			"rdi": "Residential",
			"elot_sequence": "0064",
			"elot_sort": "A",
			"latitude": 39.2858,
			"longitude": -76.66889,
			"precision": "Zip9",
			"time_zone": "Eastern",
			"utc_offset": -5,
			"dst": true
		},
		"analysis": {
			"dpv_match_code": "Y",
			"dpv_footnotes": "AABB",
			"dpv_cmra": "N",
			"dpv_vacant": "N",
			"active": "Y"
		}
	}
];


// From the GitHub API
var sampleJson2 = {
	"id": 1296269,
	"owner": {
		"login": "octocat",
		"id": 1,
		"avatar_url": "https://github.com/images/error/octocat_happy.gif",
		"gravatar_id": "somehexcode",
		"url": "https://api.github.com/users/octocat",
		"html_url": "https://github.com/octocat",
		"followers_url": "https://api.github.com/users/octocat/followers",
		"following_url": "https://api.github.com/users/octocat/following{/other_user}",
		"gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
		"starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
		"subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
		"organizations_url": "https://api.github.com/users/octocat/orgs",
		"repos_url": "https://api.github.com/users/octocat/repos",
		"events_url": "https://api.github.com/users/octocat/events{/privacy}",
		"received_events_url": "https://api.github.com/users/octocat/received_events",
		"type": "User",
		"site_admin": false
	},
	"name": "Hello-World",
	"full_name": "octocat/Hello-World",
	"description": "This your first repo!",
	"private": false,
	"fork": false,
	"url": "https://api.github.com/repos/octocat/Hello-World",
	"html_url": "https://github.com/octocat/Hello-World",
	"clone_url": "https://github.com/octocat/Hello-World.git",
	"git_url": "git://github.com/octocat/Hello-World.git",
	"ssh_url": "git@github.com:octocat/Hello-World.git",
	"svn_url": "https://svn.github.com/octocat/Hello-World",
	"mirror_url": "git://git.example.com/octocat/Hello-World",
	"homepage": "https://github.com",
	"language": null,
	"forks_count": 9,
	"stargazers_count": 80,
	"watchers_count": 80,
	"size": 108,
	"default_branch": "master",
	"open_issues_count": 0,
	"has_issues": true,
	"has_wiki": true,
	"has_downloads": true,
	"pushed_at": "2011-01-26T19:06:43Z",
	"created_at": "2011-01-26T19:01:12Z",
	"updated_at": "2011-01-26T19:14:43Z",
	"permissions": {
		"admin": false,
		"push": false,
		"pull": true
	},
	"subscribers_count": 42,
	"organization": {
	"login": "octocat",
	"id": 1,
	"avatar_url": "https://github.com/images/error/octocat_happy.gif",
	"gravatar_id": "somehexcode",
	"url": "https://api.github.com/users/octocat",
	"html_url": "https://github.com/octocat",
	"followers_url": "https://api.github.com/users/octocat/followers",
	"following_url": "https://api.github.com/users/octocat/following{/other_user}",
	"gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
	"starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
	"subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
	"organizations_url": "https://api.github.com/users/octocat/orgs",
	"repos_url": "https://api.github.com/users/octocat/repos",
	"events_url": "https://api.github.com/users/octocat/events{/privacy}",
	"received_events_url": "https://api.github.com/users/octocat/received_events",
	"type": "Organization",
	"site_admin": false
	},
	"parent": {
		"id": 1296269,
		"owner": {
			"login": "octocat",
			"id": 1,
			"avatar_url": "https://github.com/images/error/octocat_happy.gif",
			"gravatar_id": "somehexcode",
			"url": "https://api.github.com/users/octocat",
			"html_url": "https://github.com/octocat",
			"followers_url": "https://api.github.com/users/octocat/followers",
			"following_url": "https://api.github.com/users/octocat/following{/other_user}",
			"gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
			"starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
			"subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
			"organizations_url": "https://api.github.com/users/octocat/orgs",
			"repos_url": "https://api.github.com/users/octocat/repos",
			"events_url": "https://api.github.com/users/octocat/events{/privacy}",
			"received_events_url": "https://api.github.com/users/octocat/received_events",
			"type": "User",
			"site_admin": false
		},
		"name": "Hello-World",
		"full_name": "octocat/Hello-World",
		"description": "This your first repo!",
		"private": false,
		"fork": true,
		"url": "https://api.github.com/repos/octocat/Hello-World",
		"html_url": "https://github.com/octocat/Hello-World",
		"clone_url": "https://github.com/octocat/Hello-World.git",
		"git_url": "git://github.com/octocat/Hello-World.git",
		"ssh_url": "git@github.com:octocat/Hello-World.git",
		"svn_url": "https://svn.github.com/octocat/Hello-World",
		"mirror_url": "git://git.example.com/octocat/Hello-World",
		"homepage": "https://github.com",
		"language": null,
		"forks_count": 9,
		"stargazers_count": 80,
		"watchers_count": 80,
		"size": 108,
		"default_branch": "master",
		"open_issues_count": 0,
		"has_issues": true,
		"has_wiki": true,
		"has_downloads": true,
		"pushed_at": "2011-01-26T19:06:43Z",
		"created_at": "2011-01-26T19:01:12Z",
		"updated_at": "2011-01-26T19:14:43Z",
		"permissions": {
			"admin": false,
			"push": false,
			"pull": true
		}
	},
	"source": {
		"id": 1296269,
		"owner": {
			"login": "octocat",
			"id": 1,
			"avatar_url": "https://github.com/images/error/octocat_happy.gif",
			"gravatar_id": "somehexcode",
			"url": "https://api.github.com/users/octocat",
			"html_url": "https://github.com/octocat",
			"followers_url": "https://api.github.com/users/octocat/followers",
			"following_url": "https://api.github.com/users/octocat/following{/other_user}",
			"gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
			"starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
			"subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
			"organizations_url": "https://api.github.com/users/octocat/orgs",
			"repos_url": "https://api.github.com/users/octocat/repos",
			"events_url": "https://api.github.com/users/octocat/events{/privacy}",
			"received_events_url": "https://api.github.com/users/octocat/received_events",
			"type": "User",
			"site_admin": false
		},
		"name": "Hello-World",
		"full_name": "octocat/Hello-World",
		"description": "This your first repo!",
		"private": false,
		"fork": true,
		"url": "https://api.github.com/repos/octocat/Hello-World",
		"html_url": "https://github.com/octocat/Hello-World",
		"clone_url": "https://github.com/octocat/Hello-World.git",
		"git_url": "git://github.com/octocat/Hello-World.git",
		"ssh_url": "git@github.com:octocat/Hello-World.git",
		"svn_url": "https://svn.github.com/octocat/Hello-World",
		"mirror_url": "git://git.example.com/octocat/Hello-World",
		"homepage": "https://github.com",
		"language": null,
		"forks_count": 9,
		"stargazers_count": 80,
		"watchers_count": 80,
		"size": 108,
		"default_branch": "master",
		"open_issues_count": 0,
		"has_issues": true,
		"has_wiki": true,
		"has_downloads": true,
		"pushed_at": "2011-01-26T19:06:43Z",
		"created_at": "2011-01-26T19:01:12Z",
		"updated_at": "2011-01-26T19:14:43Z",
		"permissions": {
			"admin": false,
			"push": false,
			"pull": true
		}
	}
};
