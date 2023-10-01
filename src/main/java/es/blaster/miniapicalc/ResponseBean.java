package es.blaster.miniapicalc;



public class ResponseBean {

    private double a;
    private double b;
    private double c;
    private String resultado;
    private String ErrorDescription;

    public double getA() {
        return a;
    }

    public void setA(double a) {
        this.a = a;
    }

    public double getB() {
        return b;
    }

    public void setB(double b) {
        this.b = b;
    }

     public double getC() {
        return c;
    }

    public void setC(double c) {
        this.c = c;
    }

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public String getErrorDescription() {
        return ErrorDescription;
    }

    public void setErrorDescription(String ErrorDescription) {
        this.ErrorDescription = ErrorDescription;
    }
    

    
}
