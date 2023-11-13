<?php 

require('./connection/Connection.php');

$titutlo=$_POST["valor1"];


//-------------- traer la lista de facultades ------------------------
$sql="SELECT";
$sql.=" id_titulo";
$sql.=",nombre";
$sql.=" FROM";
$sql.=" gx_titulo";
		
			
$coneccion= new Connection();
$conn=$coneccion->getConnection();
			
$pstm=$conn->prepare($sql);
$pstm->execute();	
$resultado  = $pstm->fetchAll();

?>

<script>

function devolverTitulacion(index) {
	
	var titulo=document.getElementsByName('txtNombreTitulo[]')[index].value;	
	opener.document.form1.txtOpcion4.value=titulo;

	this.close();
	
	
	}
	
	function abrirAgregarTitulo() {
      
      
      var myWindow = window.open("agregarMencion.php", "", "width=800,height=150,top=300,left=500");
      myWindow.focus();
      
      
    }
	
</script>
<style type="text/css">
img {cursor:pointer}


</style>

<table class="table table-hover table-bordered table-striped">
  <tbody>
    <tr>
      <td width="10%" class="text-center">#</td>
      <td width="80%">Descripcion</td>
      <td width="10%">&nbsp;</td>
    </tr>
    
     <?php $index=-1; ?>
     <?php foreach ($resultado  as $row) { ?>
     <?php $index++; ?>
    <tr>
      <td class="text-center"><?php echo $index+1; ?></td>
      <td><?php echo $row["nombre"];?><input name="txtNombreTitulo[]" type="hidden" id="txtNombreTitulo" value="<?php echo $row["nombre"];?>"></td>
      <td class="text-center"><span class="icon icon-pencil alink" onClick="devolverTitulacion(<?php echo $index; ?>)"/></span></td>
    </tr>
    
     <?php }  ?>
     
      <tr><input type="button" onClick="abrirAgregarTitulo()" value="+"></tr>
  </tbody>
</table>
