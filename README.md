# markdown2scorm

[Markdown](https://daringfireball.net/projects/markdown/) is a commonly-used text format for documentation.
It is easy to write, can be converted to many other formats, and is therefore the basis for a lot of types
of output, such as websites, e-books, slide shows, scholarly manuscripts, and others. It is in increasingly
becoming the go-to alternative for plain text documentation files, such as the 
[README](https://en.wikipedia.org/wiki/README) documents of open source projects. What you are now reading
is such a README document in markdown format.

[SCORM](https://scorm.com/scorm-explained/) objects are bundles of content for e-learning. These bundles 
comply to a collection of standards that, in concert, allow these bundles to be deployed on a variety of
platforms. One of these platforms is [blackboard](https://www.blackboard.com/), which is a commercial tool
but which is more or less the de facto standard for many universities. (For our local purposes it is most
relevant that this includes [Leiden University](https://blackboard.leidenuniv.nl) but there are many others.)

It would therefore be useful to be able to convert markdown documents to SCORM objects, because this would
allow you to:

1. Develop documentation collaboratively using open source workflows.
2. Convert these to SCORM objects.
3. Upload these to a blackboard course and integrate them with other materials, such as:
   - Quizzes and interactive materials, e.g. as developed using [adapt](https://www.adaptlearning.org).
   - 'Traditional' slides in powerpoint or PDF, e.g. as provided by guest lecturers.

The project pulls together the different components that you would need to accomplish this.

## Convert Markdown to HTML

There are numerous options for this. **One option is to make a single HTML file**, for example like this:

    pandoc --from markdown --to=html --css=pandoc.css \
    --standalone --out=lecture1.html lecture1.md

In this case, the styling can be much improved by using [this pandoc.css](https://gist.github.com/killercup/5917178) 

**Another option is to make slides**, e.g. as follows:

    pandoc --to=slidy --standalone --out=lecture1.html lecture1.md

In this case, you may achieve more visually appealing results using some of the other options besides `slidy`, although the other ones require more supporting file scaffolding. See [here](https://pandoc.org/MANUAL.html#producing-slide-shows-with-pandoc)

## Package the HTML

2. package the html (with all assets) into a [SCORM archive](https://www.youtube.com/watch?v=wqXx3tJ3RZQ) using [libscorm](https://github.com/begriffs/libscorm)
3. upload the archive to blackboard (Content > Build content > Content Package (SCORM))
