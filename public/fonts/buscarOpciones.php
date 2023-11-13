<?php

require('./connection/Connection.php');

$idAsignatura = $_GET["idAsignatura"];

$anio = $_GET["anio"];

$asignatura = $_GET["asignatura"];


 $sql = "SELECT";
  $sql .= " numero_grupo_min";
  $sql .= ",numero_grupo_max";
  $sql .= " FROM";
  $sql .= " gx_asignatura";
  $sql .= " WHERE";
  $sql .= " id_asignatura=:id_asignatura";
  
  
  $coneccion = new Connection();
  $conn = $coneccion->getConnection();
  $pstm = $conn->prepare($sql);
  $pstm->bindParam(':id_asignatura', $id_asignatura, PDO::PARAM_INT);
  $id_asignatura = $idAsignatura;
  
  
  $pstm->execute();
  $resultado = $pstm->fetchAll();

foreach ($resultado as $row) { 
   $maximo=$row["numero_grupo_min"]; 
   $minimo=$row["numero_grupo_max"]; 

 } 



?>


<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Documento sin título</title>
  <?php require_once("head.php"); ?>
  <script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
  <style type="text/css">
    img {
      cursor: pointer
    }
    
    li {
      
      display: inline-block;
      padding: 5px;
      
    }
  
  </style>
  <script>
    
    
    function insertarOpciones() {
      
      
      var idAsignatura = document.form1.txtIdAsignatura.value;
      var anio = document.form1.txtAnio.value;
      
      var op1 = document.form1.txtOpcion1.value;
      var op2 = document.form1.txtOpcion2.value;
      var op3 = document.form1.txtOpcion3.value;
      var op4 = document.form1.txtOpcion4.value;
      var op5 = document.form1.txtOpcion5.value;
	  
	  var minimo = document.form1.txtMinimo.value;
	  var maximo = document.form1.txtMaximo.value;
      
     // var numeroMatriculados = document.form1.txtNumeroMatriculados.value;
      
      
      $("#resutadoActualizacion").empty();
      $("#resutadoActualizacion").load('actualizarOpciones.php', {
        valor1: idAsignatura
        , valor2: anio
        , valor3: op1
        , valor4: op2
        , valor5: op3
        , valor6: op4
        , valor7: op5
        , valor8: minimo
		, valor9: maximo
      });
      
    }
    
    function actualizarListaCursos() {
      
      
      //opener.document.form1.txtCodigoDescripcion[indiceFila].value=codigo_asig;
      //opener.document.form1.txtDescripcion[indiceFila].value=nombre_asig;
      
      opener.listarCursos();
      window.close();﻿
      
      
    }
    
    
    function abrirBusquedaTitulacion() {
      
      
      var myWindow = window.open("buscarOpcionesTitulaciones.php", "", "width=800,height=300,top=300,left=500");
      myWindow.focus();
      
      
    }
    
    

   
    
    function abrirBusquedaEspecializacion() {
      
      
      var myWindow = window.open("busquedaEspecializacion/buscarOpcionesEspecializacion.php", "", "width=800,height=300,top=300,left=500");
      myWindow.focus();
      
      
    }
	
	
	
	 function abrirAgregarDoctorado() {
      
      
      var myWindow = window.open("busquedaDoctorado/agregarMencion.php", "", "width=800,height=150,top=300,left=500");
      myWindow.focus();
      
      
    }
	
	 function abrirBusquedaDoctorado() {
      
      var idAsignatura = document.form1.txtIdAsignatura.value;
	  
	  
      var myWindow = window.open("busquedaDoctorado/agregarMencion.php?idAsignatura="+idAsignatura, "", "width=800,height=300,top=300,left=500");
      myWindow.focus();
      
      
    }
	
	    function abrirBusquedaMaestria() {
      
      var idAsignatura = document.form1.txtIdAsignatura.value;
	  
      var myWindow = window.open("busquedaMaestria/agregarMencion.php?idAsignatura="+idAsignatura, "", "width=800,height=300,top=300,left=500");
      myWindow.focus();
      
      
    }
  
  </script>
  <style type="text/css">
    img {
      cursor: pointer
    }
  
  
  </style>

</head>

<body>

<form name="form1">
  
  <?php echo 'Asignatura: ' . $asignatura; ?>
  
  <table class="table table-hover table-bordered table-striped">
    <tbody>
    <tr>
      <td>Dr.</td>
      <td><input name="txtOpcion1" type="text" disabled="disabled" id="txtOpcion1" class="txt100" readonly></td>
      <td class="text-center"><span class="icon icon-pencil alink" onClick="abrirBusquedaDoctorado()"/></span></td>     
    </tr>
    <tr>
      <td>Mg.</td>
      <td><input name="txtOpcion2" type="text" disabled="disabled" id="txtOpcion2" class="txt100" readonly></td>
      <td class="text-center"><span class="icon icon-pencil alink" onClick="abrirBusquedaMaestria()"/></span></td>
    </tr>
    <tr>
      <td>Esp.</td>
      <td><input name="txtOpcion3" type="text" disabled="disabled" id="txtOpcion3" class="txt100" readonly></td>
      <td class="text-center"><span class="icon icon-pencil alink" onClick="abrirBusquedaEspecializacion()"/></span>
      </td>
    </tr>
    <tr>
      <td>Titulo</td>
      <td><input name="txtOpcion4" type="text" disabled="disabled" id="txtOpcion4" class="txt100" readonly></td>
      <td class="text-center"><span class="icon icon-pencil alink" onClick="abrirBusquedaTitulacion()"/></span></td>
    </tr>
    <tr>
      <td>Otros</td>
      <td><input name="txtOpcion5" type="text" id="txtOpcion5" class="txt100"></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td>¿Forma grupos?    Grupos de: Minimo:
        <input name="txtMinimo" type="text" id="txtMinimo" value="<?php echo $minimo; ?>" size="5"> 
         Maximo:
        <input name="txtMaximo" type="text" id="txtMaximo" value="<?php echo $maximo; ?>" size="5"></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td width="96"><input type="button" name="button" id="button" value="Guardar" onClick="insertarOpciones()">
        <input name="txtIdAsignatura" type="hidden" id="txtIdAsignatura" value="<?php echo $idAsignatura; ?>">
        <input name="txtAnio" type="hidden" id="txtAnio" value="<?php echo $anio; ?>"></td>
      <td width="510">&nbsp;</td>
      <td width="56">&nbsp;</td>
    </tr>
    </tbody>
  </table>
  
  
  <div id="resutadoActualizacion">
  ...
  </div>


</form>

</body>
</html>