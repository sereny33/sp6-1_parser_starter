// @todo: напишите здесь код парсера

function parsePage() {
    function getMetaData(){
            const language = document.querySelector('html').getAttribute('lang').trim();
            const title = document.querySelector('title').textContent.split(' — ')[0].trim(); 
            const keywords = document.querySelector('meta[name="keywords"]')
                .getAttribute('content')
                .split(',')
                .map(element => element.trim()); 
            const description = document.querySelector('meta[name="description"]')
                .getAttribute('content')
                .trim(); 
            const opengraph = Array.from(document.querySelectorAll('meta[property^="og:"]'))
                .reduce((object, currentItem) => {
                    const key = currentItem.getAttribute('property').slice(3);
                    const value = currentItem.getAttribute('content')
                        if(key === "title") {
                            object[key] = value.split(' — ')[0].trim()
                        } else {
                            object[key] = value;
                        }
                    return object;
                }, {})
                
                return {
                    language, title, keywords, description, opengraph
                }
    }

    function getProductData() {
        const id = document.querySelector('.product').dataset.id;
        const name = document.querySelector('h1').textContent;
        const isLiked = document.querySelector('button.like').classList.contains('active');
        const price = +document.querySelector('.price') 
            .textContent
            .match(/\d+/g)[0]
        const oldPrice = +document.querySelector('.price')
            .textContent
            .match(/\d+/g)[1]
       
        function getTags() {
            let tags = document.querySelector('.tags').children
            let result = {}
            for (const item of tags) {
                let tagColor = item.className
                if (tagColor === "green") result.category = [item.textContent]
                if (tagColor === "blue") result.label = [item.textContent]
                if (tagColor === "red") result.discount = [item.textContent]
            }
            return result
        }
        const tags = getTags();

        function getImageData() {
            let imageSet = document.querySelectorAll('nav img');
            let result = []
            for (const img of imageSet) {
                let resultObject = {
                    preview: img.getAttribute('src'),
                    full: img.dataset.src,
                    alt: img.getAttribute('alt')
                }

                result.push(resultObject);
            }
            return result
        }
        const images = getImageData();
        
        const discount = ((oldPrice - price) !== 0) ? oldPrice - price : 0  
        const discountPercent = `${((discount / oldPrice) * 100).toFixed(2)}%`

        function getCurrency() {
            const priceContent = Array.from(document.querySelector('.price').textContent)
            let result 
            const currencies = {
                "$": "USD",
                "€": "EUR",
                "₽": "RUB"
            }

            if (priceContent.includes('₽')) result = currencies["₽"];
            if (priceContent.includes('$')) result = currencies["$"];
            if (priceContent.includes('€')) result = currencies["€"];

            return result
        }
        const currency = getCurrency();

        function getPropetries() {
            const elements = document.querySelectorAll('.properties li span')
            let propertiesArr = []

            for (const element of elements) (
                propertiesArr.push(`${element.textContent}`)
            )

            const propertiesObj = {}

            for (let i = 0; i < propertiesArr.length; i+=2) {
                propertiesObj[propertiesArr[i]] = propertiesArr[i+1]
            }

            return propertiesObj
        }
        const properties = getPropetries();

        function getDescription() {
            return document.querySelector('.description')
                .innerHTML
                .trim()
                .replace(/\sclass="[^"]*"/g, '')
        }

        const description = getDescription();

        return {
            id, 
            name, 
            isLiked, 
            tags,
            price,
            oldPrice,
            discount,
            discountPercent,
            currency,
            properties,
            description,
            images
        }
    }

    function getSuggestedData() {
        return []
    }

    function getReviewData() {
        return []
    }

    return {
        meta: getMetaData(),
        product: getProductData(),
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;

// {
//   "meta": {
//     "title": "About Vite",
//     "description": "Explore Vite - A modern development tool for faster and efficient web applications. Learn about features, suggested products, and reviews.",
//     "keywords": [
//       "Vite",
//       " modern development tool",
//       " web development",
//       " UI design",
//       " UX design",
//       " prototyping",
//       " reviews"
//     ],
//     "language": "en",
//     "opengraph": {
//       "title": "About Vite",
//       "image": "./assets/logo.svg",
//       "type": "website"
//     }
//   },
//   "product": {
//     "id": "product1",
//     "name": "About Vite",
//     "isLiked": false,
//     "tags": {
//       "category": [
//         "tag1"
//       ],
//       "discount": [
//         "tag3"
//       ],
//       "label": [
//         "tag2"
//       ]
//     },
//     "price": 50,
//     "oldPrice": 80,
//     "discount": 30,
//     "discountPercent": "37.50%",
//     "currency": "RUB",
//     "properties": {
//       "key1": "value1",
//       "key2": "value2",
//       "key3": "value3"
//     },
//     "description": "<h3>Title</h3>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>\n                <p>Answer the freaquently asked question in a simple sentence, a longish paragraph, or even in a list.</p>",
//     "images": [
//       {
//         "preview": "https://placehold.co/92x66?text=1",
//         "full": "https://placehold.co/600?text=1",
//         "alt": "slide1"
//       },
//       {
//         "preview": "https://placehold.co/92x66?text=2",
//         "full": "https://placehold.co/600?text=2",
//         "alt": "slide2"
//       },
//       {
//         "preview": "https://placehold.co/92x66?text=3",
//         "full": "https://placehold.co/600?text=3",
//         "alt": "slide3"
//       },
//       {
//         "preview": "https://placehold.co/92x66?text=4",
//         "full": "https://placehold.co/600?text=4",
//         "alt": "slide4"
//       },
//       {
//         "preview": "https://placehold.co/92x66?text=5",
//         "full": "https://placehold.co/600?text=5",
//         "alt": "slide5"
//       }
//     ]
//   },
//   "suggested": [
//     {
//       "name": "test title",
//       "description": "desc about product",
//       "image": "https://placehold.co/240x300?text=A",
//       "price": "34123",
//       "currency": "RUB"
//     },
//     {
//       "name": "test title",
//       "description": "desc about product",
//       "image": "https://placehold.co/240x300?text=A",
//       "price": "34123",
//       "currency": "RUB"
//     },
//     {
//       "name": "test title",
//       "description": "desc about product",
//       "image": "https://placehold.co/240x300?text=A",
//       "price": "34123",
//       "currency": "RUB"
//     },
//     {
//       "name": "test title",
//       "description": "desc about product",
//       "image": "https://placehold.co/240x300?text=A",
//       "price": "34123",
//       "currency": "RUB"
//     }
//   ],
//   "reviews": [
//     {
//       "rating": 2,
//       "author": {
//         "avatar": "https://placehold.co/48/424242/white.svg?text=1",
//         "name": "author"
//       },
//       "title": "title",
//       "description": "desc",
//       "date": "date"
//     },
//     {
//       "rating": 4,
//       "author": {
//         "avatar": "https://placehold.co/48/424242/white.svg?text=1",
//         "name": "author"
//       },
//       "title": "title",
//       "description": "desc",
//       "date": "date"
//     },
//     {
//       "rating": 3,
//       "author": {
//         "avatar": "https://placehold.co/48/424242/white.svg?text=1",
//         "name": "author"
//       },
//       "title": "title",
//       "description": "desc",
//       "date": "date"
//     }
//   ]
// }