package softwaretools.server02;

import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

@Component("templates")
public class Templates {
    private final TemplateEngine engine;
    
    public Templates() {
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setPrefix("templates/");
        engine = new SpringTemplateEngine();
        engine.setTemplateResolver(resolver);
    }
    
    public String render(String template, Context c) {
        return this.engine.process(template, c);
    }
}
