b.map_ad_type = function(adTypeId) {
    switch(adTypeId) {
        case "2":
        case "6":
        case "9":
            return "rent";
        default:
            return "sell";
    }
};

b.resolve_categories = function(ad) {
    if (ad.categories) {
        for (var i = 0; i < ad.categories.length; i++) {
            ad.categories[i]["@type"] = ad.categories[i].type;
        }
        return ad.categories;
    } else {
        return [];
    }
}

b.resolve_publisher = function(ad) {
    if (ad.publisher) {
        ad.publisher["@id"] = ad.publisher.id;
        ad.publisher["@type"] = "Account";

        delete ad.publisher.id;
        delete ad.publisher.type;
        return ad.publisher;
    } else {
        return [];
    }
}

b.map_category = function(ad) {
    var cat = "";

    if (ad.categories) {
        for (var i = ad.categories.length - 1; i >= 0; i--) {
            var category = ad.categories[i];
            if (cat.length <= 0) {
                cat += category.name
            } else {
                cat += ' > ' + category.name;
            }
        }
    } else {
        var adTypeId = ad.adTypeId;
        switch(adTypeId) {
            case "20":
            case "21":
            case "25":
            case "26":
                cat = "Motor";
                break;
            case "66":
            case "67":
            case "68":
            case "69":
                cat = "Generalist";
                break;
            case "40":
            case "49":
                cat = "Jobs";
                break;
            default:
                cat = "Realestate";
        }

        if (ad.category_level_1) {
            cat += " > " + ad.category_level_1;
        }
        if (b['category_level_2']) {
            cat += " > " + ad.category_level_2;
        }
        if (ad.category_level_3) {
            cat += " > " + ad.category_level_3;
        }
        if (ad.category_level_4) {
            cat += " > " + ad.category_level_4;
        }
        if (b['category_level_5']) {
            cat += " > " + ad.category_level_5;
        }
    }


    return cat;
};

b.make_location = function(ad) {
    var location = ad.location;
    if (location) {
        location['@type'] = 'PostalAddress';
    }
    return location;
};

b.make_classified_ad_iad = function(ad) {
    var id = ad.adId;
    var name = ad.title;
    var sdrn = "sdrn:willhabenat:classified:iad:"+id.toString();
    var adId = id;
    var publisher = undefined;

    if (ad.sellerUuid) {
        publisher = {};
        publisher["@id"] = "sdrn:iad.willhaben.at:user:" + ad.sellerUuid;
        publisher["@type"] = "Account";
    }
    var ad_location = b.make_location(ad);
    var result = {
        adId: parseInt(adId),
        adType: b.map_ad_type(ad.adTypeId),
        category: b.map_category(ad),
        categories: b.resolve_categories(ad),
        contentId: adId,
        name: name,
        publisher: b.resolve_publisher(ad),
        publishertype: ad.publisherType,
        location: ad_location,
        price: parseInt(ad.price)
    };
    result["@id"] = sdrn;
    result["@type"] = 'ClassifiedAd';
    result["currency"] = 'EUR';
    return result;
};

