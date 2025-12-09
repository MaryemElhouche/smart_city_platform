package com.city.data.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GraphiQLController {

    @GetMapping({"/graphiql", "/graphql/graphiql"})
    public String graphiql() {
        return "graphiql";
    }
}
