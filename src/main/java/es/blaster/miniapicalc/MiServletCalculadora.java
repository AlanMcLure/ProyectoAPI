package es.blaster.miniapicalc;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MiServletCalculadora extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");

        Gson oGson = new Gson();

        PrintWriter out = response.getWriter();

        if (request.getParameter("op").contentEquals("calcula")) {

            if (!(request.getSession().getAttribute("alumnadodaw") == null)) {

                ResponseBeanSession oRBSession = new ResponseBeanSession();
                oRBSession.setErrorMsg("No hay sesión");
                response.setStatus(500);
                out.print(oGson.toJson(oRBSession));

            } else {

                try {
                    ResponseBean oRB = oGson.fromJson(request.getReader(), ResponseBean.class);

                    // Obtener los coeficientes "a", "b" y "c" de la solicitud
                    double a = oRB.getA();
                    double b = oRB.getB();
                    double c = oRB.getC();

                    // Calcular las soluciones de la ecuación cuadrática
                    double discriminante = b * b - 4 * a * c;
                    if (discriminante > 0) {
                        double solucion1 = (-b + Math.sqrt(discriminante)) / (2 * a);
                        double solucion2 = (-b - Math.sqrt(discriminante)) / (2 * a);
                        oRB.setResultado("Solucion 1: " + solucion1 + ", Solucion 2: " + solucion2);
                    } else if (discriminante == 0) {
                        double solucionUnica = -b / (2 * a);
                        oRB.setResultado("Solucion unica: " + solucionUnica);
                    } else {
                        oRB.setResultado("No hay soluciones reales");
                    }

                    // Establecer el código de estado y enviar la respuesta
                    response.setStatus(200);
                    out.print(oGson.toJson(oRB));
                } catch (JsonIOException e) {
                    response.setStatus(500);
                    ResponseBean oRB = new ResponseBean();
                    oRB.setErrorDescription("Error en JSON 1");
                    out.print(oGson.toJson(oRB));
                } catch (IOException e) {
                    response.setStatus(500);
                    ResponseBean oRB = new ResponseBean();
                    oRB.setErrorDescription("Error en JSON 2");
                    out.print(oGson.toJson(oRB));
                } catch (JsonSyntaxException e) {
                    response.setStatus(500);
                    ResponseBean oRB = new ResponseBean();
                    oRB.setErrorDescription("Error en JSON 3");
                    out.print(oGson.toJson(oRB));
                }
            }

        } else {

            if (request.getParameter("op").equalsIgnoreCase("login")) {
                ResponseBeanSession oRBSession = oGson.fromJson(request.getReader(), ResponseBeanSession.class);
                if (oRBSession.getUsername().equals("alan") && oRBSession.getPassword().equals("72b37a5cce60840d1392a19392165d1e8531e4e0b6bbeb122588e73a20024ebd")) {
                    request.getSession().setAttribute("alumnadodaw", oRBSession.getUsername());
                    ResponseBeanSession oRBSession1 = new ResponseBeanSession();
                    oRBSession1.setUsername(oRBSession.getUsername());
                    oRBSession1.setPassword("");
                    response.setStatus(200);
                    out.print(oGson.toJson(oRBSession1));
                } else {
                    ResponseBeanSession oRBSession1 = new ResponseBeanSession();
                    oRBSession1.setUsername(oRBSession.getUsername());
                    oRBSession1.setPassword("");
                    oRBSession1.setErrorMsg("error en la autenticacion");
                    response.setStatus(500);
                    out.print(oGson.toJson(oRBSession1));

                }
            } else {
                if (request.getParameter("op").equalsIgnoreCase("logout")) {
                    request.getSession().invalidate();
                    response.setStatus(200);
                } else {
                    if (request.getParameter("op").equalsIgnoreCase("check")) {
                        if (request.getSession().getAttribute("alumnadodaw") == null) {
                            ResponseBeanSession oRBSession = new ResponseBeanSession();
                            oRBSession.setErrorMsg("No hay sesión");
                            response.setStatus(500);
                            out.print(oGson.toJson(oRBSession));
                        } else {
                            ResponseBeanSession oRBSession = new ResponseBeanSession();
                            oRBSession.setUsername(request.getSession().getAttribute("alumnadodaw").toString());
                            response.setStatus(200);
                            out.print(oGson.toJson(oRBSession));
                        }
                    } else {
                        response.setStatus(500);
                        ResponseBean oRB = new ResponseBean();
                        oRB.setErrorDescription("Error en parametro");
                        out.print(oGson.toJson(oRB));
                    }

                }
            }

        }

    }

}
