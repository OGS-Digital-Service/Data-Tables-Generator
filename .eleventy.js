module.exports = function(eleventyConfig){
    eleventyConfig.setTemplateFormats([
        "md",
        "njk",
        "hbs"
      ]);

      eleventyConfig.addPassthroughCopy("img");
      eleventyConfig.addPassthroughCopy("fonts");
      eleventyConfig.addPassthroughCopy("js");
      eleventyConfig.addPassthroughCopy("css");
    

    return {
        markdownTemplateEngine: "njk",    
    dir: {
        layouts: "_layouts",
        output: "_site"
    }
    }
   
};