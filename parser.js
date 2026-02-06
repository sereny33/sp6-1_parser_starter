function parsePage() {
// getMetaData() собирает метаданные со страницы
    function getMetaData(){
            const language = document.querySelector('html').getAttribute('lang').trim(); // язык страницы
            const title = document.querySelector('title').textContent.split(' — ')[0].trim(); // заголовок страницы без описания
            const keywords = document.querySelector('meta[name="keywords"]') // список ключевых слов
                .getAttribute('content')
                .split(',')
                .map(element => element.trim()); 
            
            const description = document.querySelector('meta[name="description"]') // описание страницы
                .getAttribute('content')
                .trim(); 
            
            const opengraph = Array.from(document.querySelectorAll('meta[property^="og:"]')) // ищем теги со свойством начинающимся на og:
                .reduce((object, currentItem) => { // собираем объект из найденных тегов
                    const key = currentItem.getAttribute('property').slice(3); // используем текущее свойство без og: в начале
                    const value = currentItem.getAttribute('content') // используем значение аттрибута content
                        if(key === "title") { // если текщее свойство это title, обрезаем заголовок и пробелы 
                            object[key] = value.split(' — ')[0].trim()
                        } else { // иначе кладем свойсво в объект как есть
                            object[key] = value;
                        }
                    return object;
                }, {})
                
                return { language, title, keywords, description, opengraph } 
    }

// функция getCurrency(string) переиспользуется в нескольких местах. 
// Принимает строку, провреяет есть ли внутри символ валюты, если есть возвращает код валюты
    function getCurrency(string) {
        let result 
        const currencies = {
            "$": "USD",
            "€": "EUR",
            "₽": "RUB"
        }
        if (string.includes('₽')) result = currencies["₽"];
        if (string.includes('$')) result = currencies["$"];
        if (string.includes('€')) result = currencies["€"];
        return result
    }

// getProductData() собирает данные о товаре со страницы
    function getProductData() {
        const id = document.querySelector('.product').dataset.id;
        const name = document.querySelector('h1').textContent;
        const isLiked = document.querySelector('button.like').classList.contains('active');
        const price = +document.querySelector('.price') // выбираем элемент с классом .price
            .textContent // берем содержимое элемента
            .match(/\d+/g)[0] // ищем чисельные совпадения помощи regex, получаем массив результатов, используем нужный 
        const oldPrice = +document.querySelector('.price')
            .textContent
            .match(/\d+/g)[1] // ищем чисельные совпадения помощи regex, получаем массив результатов, используем нужный 
       
        // Функция проходится по тегам и сортирует теги по цвету, образуя объект с содержмым элементов-тегов   
        function getTags() {
            const tags = document.querySelector('.tags').children
            const result = {}
            for (const item of tags) {
                const tagColor = item.className
                if (tagColor === "green") result.category = [item.textContent]
                if (tagColor === "blue") result.label = [item.textContent]
                if (tagColor === "red") result.discount = [item.textContent]
            }
            return result
        }
        const tags = getTags();

        // Собираем данные об изображениях товара
        function getImageData() {
            const imageSet = document.querySelectorAll('nav img');
            const result = []
            for (const img of imageSet) {
                const resultObject = {
                    preview: img.getAttribute('src'),
                    full: img.dataset.src,
                    alt: img.getAttribute('alt')
                }
                result.push(resultObject);
            }
            return result
        }
        const images = getImageData();
        
        // Рассчитываем скидку
        const discount = ((oldPrice - price) !== 0) ? oldPrice - price : 0  
        // Рассчитываем скидку в процентах, округляем до 2 чисел после запятой
        const discountPercent = `${((discount / oldPrice) * 100).toFixed(2)}%`

        // Получаем код валюты товара 
        const currency = getCurrency(document.querySelector('.price').textContent);

        // Получем объект свойств товара
        function getPropetries() {
            const elements = document.querySelectorAll('.properties li span') // собираем весь список свойств - значений
            const propertiesArr = [] // создаем массив- хранилище для названий свойств и значений

            for (const element of elements) (
                propertiesArr.push(`${element.textContent}`) // заполняем массив строками  названий свойств и их значений
            )

            const propertiesObj = {} // создаем объект-хранилище для пар ключ-значение свойств товара

            for (let i = 0; i < propertiesArr.length; i+=2) { // проходимся по массиву с шагом в 2 элемента, чтобы выбирать только ключи
                propertiesObj[propertiesArr[i]] = propertiesArr[i+1] // записываем в ключ значение текущего элемента, а в значение - соседний элемент массива
            }

            return propertiesObj // возвращаем объект формата ключ: значение
        }
        const properties = getPropetries();

        // Получаем описание
        const description = document.querySelector('.description') 
                .innerHTML
                .trim()
                .replace(/\sclass="[^"]*"/g, '') // в содержимом строки ищем то, что начинается с "пробелclass=" " и заменяем на пустое место, чтобы избавиться от классов в строке"

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
    
    // getSuggestedData() собирает данные о предлагаемых товарах
    function getSuggestedData() {
        const result = []; // создаем массив - хранилище для результата
        const suggestedProducts = document.querySelector('div.items').querySelectorAll('article')// выбираем все карточки предлагаемых товаров 
               
        for (const article of suggestedProducts) { // проходимся по каждой карточке
            const image = article.querySelector('img').getAttribute('src'); 
            const name = article.querySelector('h3').textContent;
            const price = article.querySelector('b').textContent.match(/\d+/g)[0];
            const currency = getCurrency(Array.from(article.querySelector('b').textContent));
            const description = article.querySelector('p').textContent;

            result.push({name, description, image, price, currency}) // записываем в массив-результат объект с данными карточки

        }
        return result 

    }
    
    // getReviewData() собирает данные о карточках с отзывами
    function getReviewData() {
        const result = []; // создаем массив - хранилище для результата
        const reviews = document.querySelectorAll('div.items')[1].querySelectorAll('article') // выбираем все карточки отзывов
               
        for (const article of reviews) { // проходимся по каждой карточке
            const rating = Array.from(article.querySelectorAll('.filled')).length; // создаем массив элементов с классом filled и считаем количество элементов - результат это число рейтинга
            const title = article.querySelector('.title').textContent.trim();
            const description = article.querySelector('p').textContent.trim();
            const date = article.querySelector('.author i') // получаем дату в формате DD/MM/YYYY
                .textContent
                .replace(/(\d+)\/(\d+)\/(\d+)/, '$1.$2.$3') // используем regex ищем "число$1/число$2/число$3", заменяем на "число$1.число$2.число$3" можно также менять порядок 
            
            function getAuthor() { 
                const author = article.querySelector('.author');
                const avatar = author.querySelector('img').getAttribute('src');
                const name = author.querySelector('span').textContent.trim();
                return {avatar, name}
            }
            const author = getAuthor()

            result.push({rating, author, title, description, date})

        }
        return result

    }

    return {
        meta: getMetaData(),
        product: getProductData(),
        suggested: getSuggestedData(),
        reviews: getReviewData()
    };
}

window.parsePage = parsePage;
