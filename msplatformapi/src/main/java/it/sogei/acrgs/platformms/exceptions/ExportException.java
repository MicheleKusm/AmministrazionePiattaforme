package it.sogei.acrgs.platformms.exceptions;

import java.util.List;

public class ExportException extends Exception {
    private final List<String> errors;

    public ExportException(List<String> errors) {
        super(String.join(", ", errors));
        this.errors = errors;
    }

    public ExportException(String message) {
        super(message);
        this.errors = List.of(message);
    }

    public List<String> getErrors() {
        return errors;
    }
}