# ins-saver 

[![NPM version](https://img.shields.io/npm/v/koa-router.svg?style=flat)](https://npmjs.org/package/ins-saver) [![NPM Downloads](https://img.shields.io/npm/dm/koa-router.svg?style=flat)](https://npmjs.org/package/ins-saver) [![Node.js Version](https://img.shields.io/node/v/koa-router.svg?style=flat)](http://nodejs.org/download/) [![Build Status](https://img.shields.io/travis/alexmingoia/koa-router.svg?style=flat)](https://github.com/Changlon/ins-saver) [![Gitter Chat](https://img.shields.io/badge/gitter-join%20chat-1dce73.svg?style=flat)](https://github.com/Changlon/ins-saver/issues)

> Give me an instagram link to return the JSON data for your related resources [ins-saver](https://github.com/Changlon/ins-saver)

* Deft, lightweight reptilian tools，To help you access the critical data on instagram.
* Support for `Typescript type checking` 
* Support for Links to  `posts` and `igtv`.
* ES7 async/await support.

## Installation

Install using [npm](https://www.npmjs.org/):

```sh
npm install ins-saver
```
Install using [yarn](https://www.npmjs.org/):

```sh
yarn add ins-saver
```

## API Reference
  
* [ins-saver](#module_ins-saver)
    * [InsSaver](#exp_module_ins-saver--InsSaver) ⏏
        * [new InsSaver([opts])](#new_module_ins-saver--InsSaver_new)
        * _instance_
            * [.analysisPost(urlOrCode,handleDataCallback)](#module_ins-saver--InsSaver+analysisPost) ⇒ <code>InsSaver</code>
            * [.analysisIg(urlOrCode,handleDataCallback)](#module_ins-saver--InsSaver+analysisIg) ⇒ <code>InsSaver</code>
            * [.download(url,filename?)](#module_ins-saver-InsSaver+download) ⇒ <code>Promise<data:downloadFileType> </code>
        * _static_
          * [.warn(msg)](#) ⇒ <code>void </code>
          * [.info(msg)](#) ⇒ <code> void </code>
          * [.title(msg,color?,indent?)](#) ⇒ <code> void </code>
          * [.log(o,tit?,color?,indent ?)](#) ⇒ <code> void </code>
          * [.createUrl(urlOrCode)](#) ⇒ <code> string </code>
          * [.createTvUrl(urlOrCode)](#) ⇒ <code> string </code>
          * [.getShortCode(url)](#) ⇒ <code> string </code>
					

	            	
		

<a name="exp_module_ins-saver--InsSaver"></a>

### InsSaver ⏏
**Kind**: Exported class  
<a name="new_module_ins-saver--InsSaver_new"></a>

#### new InsSaver([opts])
Create a new InsSaver.


| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>Object</code> |  |
| [opts.getCookie] | <code>async function</code> | Return the cookies |
| [opts.downloadPath] | <code>String</code> | The path to save the resource |
| [opts.outCookie]? | <code>async function</code> | The Hook function to call when a cookie fails |
| [opts.proxy]?| <code>String</code> | Proxy address |
| [opts.switchCookieInterval]? | <code>number</code> | Time interval to switch cookies |
| [opts.useCookieMaxNum]? | <code>number</code> | Maximum number of cookies used |
| [opts.cookies]? | <code>CookieType[]</code> |  Use the cookies provided directly if there is a cookies option|

**Example**  
Basic usage:

```javascript
var InsSaver = require('ins-saver');
var config = {
    getCookie:async function (){
       return ["csrftoken=hxGbDuBHR4nM2C0cVVHrsDT4pDfnGXMy;rur=ATN;ds_user_id=48888644144;sessionid=48888644144%3AATiVVxHTkAI8Dx%3A3"
       ]
    },
    downloadPath: "D:\\ins-saver\\resources\\",
    switchCookieInterval:1000 * 60,
    proxy:"http://127.0.0.1:1080" // if use proxy
}
var saver = new InsSaver(config);
//return the json data related to the link
saver.analysisPost("https://www.instagram.com/p/CXDzvDrPQry__/?utm_medium=copy_link",async (data)=>{ 
   	// handle the json data
}) 
```

<a name="module_ins-saver--InsSaver+analysisPost"></a>


#### saver.analysisPost ⇒ <code>InsSaver</code>

crawls JSON-FORMATTED data like post links 
<code>https://www.instagram.com/p/CXDzvDrPQry/?utm_medium=copy_link </code>


```javascript 
saver.analysisPost("https://www.instagram.com/p/CXDzvDrPQry__/?utm_medium=copy_link",async (data)=>{ 
	//The Hook function call passes in the parsed JSON data
}) 
```

The data format that needs to be processed looks something like this ：
```typescript
 type InsJsonDataType = {  
        id:number,
        shortcode:string,
        caption:string, //post desc
        owner:{ 
            id:number,
            profile_pic_url:string, 
            username:string,
            full_name:string,
        },
        is_multiple:boolean,
        list: {
            id:string,
            shortcode:string,
            display_url:string,
            url:string,
            is_video:boolean,
            type:string,
            typename:string
        }[]
    }
```


<a name="module_ins-saver--InsSaver+analysisIg"></a>

#### saver.analysisIg⇒ <code>InsSaver</code>

crawls JSON-FORMATTED data like Igtv links 
<code>https://www.instagram.com/tv/CQI4IrrD2mU/?utm_medium=copy_link</code>

The Usage is the same as ```analysisPost```, except that the ```list``` array in the returned ```data``` contains only one piece of data

 
<a name="module_ins-saver-InsSaver+download"></a>

#### saver.download([url], [filename]?) ⇒ <code>Promise<data:downloadFileType></code>
When you get the JSON data, you can use the download function to download the resource you want!

Example Usage:

```
saver.download(data.owner.profile_pic_url,data.owner.username)
.then( res => {
	//res contains some information about the downloaded resource when the download is successful, or it contains an error message
})
```
The res data format that needs to be processed looks something like this ：
```js
// when success 
  { 
	status: "ok",
	statusCode: 200 ,
	createtime,
	filename,
	filepath,
	fullpath,
	size
  }

// when error
 { 
	status: "error",
	statusCode,
	createtime,
	error
  }

```

## Typings

some typescript typings [github](https://github.com/Changlon/ins-saver/tree/main/typings)

## Contributing

Please submit all issues and pull requests to the [Changlon/ins-saver](http://github.com/Changlon/ins-saver) repository!

## Tests

Run tests using `yarn test`.

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/Changlon/ins-saver/issues).


